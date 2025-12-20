import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Annotate Memes",
  description: "Annotate Bangla memes with descriptive captions. Contribute to the first large-scale dataset for Bangla meme explanation and role labeling.",
};

export default function AnnotateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

