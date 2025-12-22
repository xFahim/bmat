"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

/**
 * Navigation hook with transition support
 * Provides smooth navigation with loading states
 */
export function useNavigation() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const navigate = (path: string) => {
    startTransition(() => {
      router.push(path);
    });
  };

  return {
    navigate,
    isPending,
    router,
  };
}






