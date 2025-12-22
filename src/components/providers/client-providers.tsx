import React from "react";
import { MemeProvider } from "@/context/meme-context";
import { UserProvider } from "@/context/user-context";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <MemeProvider>
        {children}
      </MemeProvider>
    </UserProvider>
  );
}
