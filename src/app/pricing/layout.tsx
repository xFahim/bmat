import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing & Policy",
  description:
    "Understand how BMAT rewards work: how much you earn per meme, how reviews work, and when you get paid.",
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}





