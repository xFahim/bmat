"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  HeroSection,
  AuthSection,
  HeroBackground,
  FloatingBanglaLetters,
} from "@/components/home";
import { useToast } from "@/hooks/use-toast";
import { getErrorDisplayInfo } from "@/lib/auth/utils/error-handler";

function HomeContent() {
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const errorCode = searchParams.get("error");
    const errorInfo = getErrorDisplayInfo(errorCode);

    if (errorInfo) {
      toast({
        variant: errorInfo.variant,
        title: errorInfo.title,
        description: errorInfo.description,
      });
    }
  }, [searchParams, toast]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        {/* Hero Section with Background */}
        <div className="relative min-h-screen bg-background">
          <FloatingBanglaLetters />
          <HeroBackground />
          <div className="relative z-10 flex min-h-screen items-center justify-center">
            <div className="w-full max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
              <HeroSection />
            </div>
          </div>
        </div>

        {/* Auth Section with its own background */}
        <AuthSection />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <HomeContent />
    </Suspense>
  );
}
