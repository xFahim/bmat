import { HeroTitle } from "./hero-title";
import { HeroSubtitle } from "./hero-subtitle";
import { HeroDescription } from "./hero-description";

/**
 * Hero Section Component
 * Main hero section containing title, subtitle, and description
 */
export function HeroSection() {
  return (
    <div className="flex flex-col justify-center space-y-6 text-center">
      <HeroTitle />
      <HeroSubtitle />
      <HeroDescription />
    </div>
  );
}
