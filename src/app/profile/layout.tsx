import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Profile",
  description: "View your annotation history, track your progress, and manage your contributions to the BMAT dataset.",
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}











