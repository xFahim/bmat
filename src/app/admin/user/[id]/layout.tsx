import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "User Review",
  description: "Review and manage user annotations in the BMAT system.",
};

export default function UserReviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

