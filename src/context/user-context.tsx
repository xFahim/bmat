"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { getUserHistory } from "@/services/user";
import type { Annotation } from "@/types/annotations";
import { checkUserAdminStatus } from "@/app/profile/actions";

interface UserProfile {
  name: string;
  avatarUrl?: string;
}

interface UserContextType {
  user: { id: string } | null;
  profile: UserProfile | null;
  annotations: Annotation[];
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      const {
        data: { user: currentUser },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !currentUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      setUser({ id: currentUser.id });

      // Parallel Fetching
      const [adminStatus, profileData, historyResult] = await Promise.all([
        checkUserAdminStatus().catch(e => {
            console.error("Admin check failed", e);
            return false;
        }),
        supabase
          .from("profiles")
          .select("full_name, avatar_url")
          .eq("id", currentUser.id)
          .single(),
        getUserHistory(supabase, currentUser.id),
      ]);

      // Set Admin
      setIsAdmin(!!adminStatus);

      // Set Profile
      if (profileData.data) {
        setProfile({
          name: profileData.data.full_name || currentUser.email?.split("@")[0] || "User",
          avatarUrl: profileData.data.avatar_url,
        });
      } else {
        setProfile({
            name: currentUser.email?.split("@")[0] || "User",
        });
      }

      // Set Annotations
      if (historyResult.success) {
        const converted: Annotation[] = historyResult.annotations.map((item) => ({
            id: item.id,
            memeUrl: item.memeUrl,
            explanation: item.caption,
            status:
              item.status.charAt(0).toUpperCase() +
              item.status.slice(1) as "Pending" | "Approved" | "Rejected",
            memeId: item.meme_id.toString(),
        }));
        setAnnotations(converted);
      } else {
        setError(historyResult.error || "Failed to fetch annotations");
      }

    } catch (err) {
      console.error("Error in UserProvider:", err);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial Fetch
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  return (
    <UserContext.Provider
      value={{
        user,
        profile,
        annotations,
        isAdmin,
        loading,
        error,
        refreshProfile: fetchUserData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
}
