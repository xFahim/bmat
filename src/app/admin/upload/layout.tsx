import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Upload Memes",
  description: "Upload multiple Bangla meme images to the BMAT system for annotation.",
};

export default function AdminUploadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}








