"use client";

import React from "react";
import { MemeProvider } from "@/context/meme-context";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <MemeProvider>
      {children}
    </MemeProvider>
  );
}
