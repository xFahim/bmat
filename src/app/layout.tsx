import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { PageTransitionLoader } from "@/components/shared";
import { ClientProviders } from "@/components/providers/client-providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const trickster = localFont({
  src: "../../public/fonts/Trickster-Reg.otf",
  variable: "--font-trickster",
  display: "swap",
});

const frick = localFont({
  src: "../../public/fonts/Frick0.3-Condensed.otf",
  variable: "--font-frick",
  display: "swap",
});

const ribes = localFont({
  src: "../../public/fonts/Ribes-Regular.otf",
  variable: "--font-ribes",
  display: "swap",
});

const escapist = localFont({
  src: "../../public/fonts/Escapist_Diaries.otf",
  variable: "--font-escapist",
  display: "swap",
});

const nultien = localFont({
  src: "../../public/fonts/Nultien-Bold.otf",
  variable: "--font-nultien",
  display: "swap",
});

const kulture = localFont({
  src: "../../public/fonts/Kulture.otf",
  variable: "--font-kulture",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "BMAT - Bangla Meme Annotation Tool",
    template: "%s | BMAT",
  },
  description: "A web application for annotating Bangla memes, developed for academic research at BRAC University. Contribute to the first large-scale dataset for Bangla meme explanation and role labeling.",
  keywords: ["BMAT", "Bangla Meme", "Annotation Tool", "BRAC University", "Academic Research"],
  authors: [{ name: "BRAC University" }],
  creator: "BRAC University",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${trickster.variable} ${frick.variable} ${ribes.variable} ${escapist.variable} ${nultien.variable} ${kulture.variable} antialiased`}
      >
        <ClientProviders>
          <PageTransitionLoader />
          {children}
          <Toaster />
        </ClientProviders>
      </body>
    </html>
  );
}
