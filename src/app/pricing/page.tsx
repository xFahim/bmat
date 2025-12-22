"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { TopNav } from "@/components/annotate";
import { HeroSection } from "./components/hero-section";
import { RealityCheckSection } from "./components/reality-check-section";
import { TheGoalSection } from "./components/the-goal-section";
import { HowToSection } from "./components/how-to-section";
import { TheRulesSection } from "./components/the-rules-section";

export default function PricingPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
    };
    checkAuth();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col">
      {isAuthenticated && <TopNav />}

      <main className="flex-1">
        {/* CONSTRAINED INTRO SECTIONS */}
        <div className="mx-auto flex max-w-5xl flex-col gap-24 px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
          <HeroSection />
          <RealityCheckSection />
        </div>

        {/* FULL WIDTH SECTIONS */}
        <TheGoalSection />
        <HowToSection />
        <TheRulesSection />
      </main>
    </div>
  );
}
