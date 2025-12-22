"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GoogleIcon } from "./google-icon";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";

/**
 * AuthSection Component
 *
 * Displays the authentication/login section for BRAC University students.
 * Contains a card with Google OAuth login button.
 *
 * @returns {JSX.Element} The authentication section with login card
 */
export function AuthSection() {
  const [isLoading, setIsLoading] = useState(false);
  const { signInWithGoogle } = useAuth();

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
      // Note: User will be redirected by Supabase OAuth flow
    } catch {
      // Error is already logged in the hook
      // Could show a toast notification here if needed
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-card px-4 py-8 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md border shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Student Login</CardTitle>
          <CardDescription>
            Exclusive for BRAC University Students. Please use your official
            G-Suite account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            className="w-full"
            size="lg"
            onClick={handleLogin}
            disabled={isLoading}
          >
            <GoogleIcon />
            {isLoading ? "Connecting..." : "Continue with Google"}
          </Button>

          <div className="mt-6">
            <Link href="/pricing" className="w-full">
              <Button variant="outline" className="w-full" size="lg">
                How it works & App Policy
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
