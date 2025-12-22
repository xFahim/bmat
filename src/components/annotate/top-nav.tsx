"use client";

import { Avatar } from "@/components/ui";
import {
  ChevronDown,
  User,
  LogOut,
  UserCircle,
  FileText,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

export function TopNav() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left: BMAT Logo */}
        <button
          onClick={() => router.push("/")}
          className="flex items-center cursor-pointer hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm"
        >
          <h1 className="text-4xl font-bold text-foreground [font-family:var(--font-kulture)] mt-1">
            BMAT
          </h1>
        </button>

        {/* Right: User Menu */}
        <div className="relative flex items-center gap-3">

          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 rounded-md p-1 hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              {/* Avatar with Static Yellow Dotted Circle */}
              <div className="relative">
                {/* Static yellow dotted circle */}
                <div className="absolute inset-0 -m-1 rounded-full border-2 border-dotted border-yellow-500/60" />
                <Avatar className="h-8 w-8 relative z-10">
                  <User className="h-4 w-4 text-muted-foreground" />
                </Avatar>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
              <>
                <div
                  className="fixed inset-0 z-[-1]"
                  onClick={() => setIsOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-48 rounded-md border border-border bg-popover p-1 shadow-lg">
                  <button 
                    onClick={() => {
                      router.push("/profile");
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent"
                  >
                    <UserCircle className="h-4 w-4" />
                    Profile
                  </button>
                  <button 
                    onClick={() => {
                      router.push("/pricing");
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent"
                  >
                    <FileText className="h-4 w-4" />
                    App Policy
                  </button>
                  <div className="my-1 h-px bg-border" />
                  <button 
                    onClick={async () => {
                      try {
                        await signOut();
                        setIsOpen(false);
                        router.push("/");
                      } catch (error) {
                        console.error("Failed to sign out:", error);
                        // Error is already logged, but could show toast notification here
                      }
                    }}
                    className="w-full flex items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
