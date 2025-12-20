import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/utils/admin-auth";
import { checkRateLimit, getClientIdentifier } from "@/lib/utils/rate-limit";
import {
  validateFileUpload,
  validateSourceGroup,
  sanitizeFilename,
} from "@/lib/utils/file-validation";

const BUCKET_NAME = "memeBucket1";

export async function POST(request: Request) {
  try {
    // Step 1: Rate limiting
    const clientId = getClientIdentifier(request);
    const rateLimitResult = checkRateLimit(clientId, "/api/admin/upload-meme");

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many requests. Please try again later.",
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": "20",
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": rateLimitResult.resetTime.toString(),
          },
        }
      );
    }

    // Step 2: Verify user is authenticated AND is admin
    let adminUser;
    try {
      adminUser = await requireAdmin();
    } catch (authError) {
      const errorMessage =
        authError instanceof Error ? authError.message : "Unauthorized";
      return NextResponse.json(
        {
          success: false,
          error:
            errorMessage.includes("Admin") || errorMessage.includes("Forbidden")
              ? "Forbidden: Admin access required"
              : "Unauthorized. Please log in.",
        },
        { status: errorMessage.includes("Forbidden") ? 403 : 401 }
      );
    }

    // Step 3: Parse and validate form data
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const sourceGroup = formData.get("sourceGroup") as string;

    // Validate file
    const fileValidation = validateFileUpload(file);
    if (!fileValidation.isValid) {
      return NextResponse.json(
        { success: false, error: fileValidation.error || "Invalid file" },
        { status: 400 }
      );
    }

    // Validate source group
    const sourceGroupValidation = validateSourceGroup(sourceGroup);
    if (!sourceGroupValidation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: sourceGroupValidation.error || "Invalid source group",
        },
        { status: 400 }
      );
    }

    // Step 4: Sanitize filename and construct final filename
    const sanitizedFileName = sanitizeFilename(file.name);
    const sanitizedSourceGroup = sourceGroup.trim();
    const finalFileName = `${sanitizedSourceGroup}_${sanitizedFileName}`;

    // Step 5: Use admin client (service role) to bypass RLS policies
    // This is safe now because we've verified admin status above
    const adminClient = createAdminClient();

    // Step 6: Upload to Supabase Storage
    const { error: uploadError } = await adminClient.storage
      .from(BUCKET_NAME)
      .upload(finalFileName, file, {
        upsert: true,
      });

    if (uploadError) {
      console.error("[upload-meme] Storage upload error:", uploadError);
      // Don't expose internal error details
      return NextResponse.json(
        {
          success: false,
          error: "Failed to upload file. Please try again.",
        },
        { status: 500 }
      );
    }

    // Step 7: Insert into database
    const { error: dbError } = await adminClient.from("memes").insert({
      file_name: finalFileName,
      storage_path: finalFileName,
      source_folder: sanitizedSourceGroup,
      annotation_count: 0,
      is_active: true,
    });

    if (dbError) {
      console.error("[upload-meme] Database insert error:", dbError);
      // If database insert fails, try to clean up the uploaded file
      try {
        await adminClient.storage.from(BUCKET_NAME).remove([finalFileName]);
      } catch (cleanupError) {
        console.error("[upload-meme] Failed to cleanup uploaded file:", cleanupError);
      }

      // Don't expose internal error details
      return NextResponse.json(
        {
          success: false,
          error: "Failed to save file metadata. Please try again.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        fileName: finalFileName,
      },
      {
        headers: {
          "X-RateLimit-Limit": "20",
          "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
          "X-RateLimit-Reset": rateLimitResult.resetTime.toString(),
        },
      }
    );
  } catch (error) {
    console.error("[upload-meme] Unexpected error:", error);

    // Handle specific error cases without exposing details
    if (error instanceof Error) {
      if (error.message.includes("SUPABASE_SERVICE_ROLE_KEY")) {
        console.error("[upload-meme] Service role key missing");
        return NextResponse.json(
          {
            success: false,
            error: "Server configuration error. Please contact administrator.",
          },
          { status: 500 }
        );
      }

      if (error.message.includes("Unauthorized") || error.message.includes("Forbidden")) {
        return NextResponse.json(
          {
            success: false,
            error: error.message.includes("Forbidden")
              ? "Forbidden: Admin access required"
              : "Unauthorized. Please log in.",
          },
          { status: error.message.includes("Forbidden") ? 403 : 401 }
        );
      }
    }

    // Generic error response
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred. Please try again.",
      },
      { status: 500 }
    );
  }
}
