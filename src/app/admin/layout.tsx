import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { isUserAdmin } from '@/lib/auth/utils/admin-auth';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin dashboard for managing users, reviewing annotations, and uploading memes to BMAT.",
};

/**
 * Admin layout - protects all admin routes
 * Checks if user is authenticated and is an admin
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  // Redirect if not authenticated
  if (authError || !user) {
    redirect('/');
  }

  // Check if user is admin
  const adminStatus = await isUserAdmin(supabase, user.id, user.email);

  // Redirect if not admin
  if (!adminStatus) {
    redirect('/');
  }

  return <>{children}</>;
}

