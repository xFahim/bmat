"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TopNav } from "@/components/annotate/top-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Upload } from "lucide-react";
import { AdminStatsSection, UserTable } from "@/components/admin";
import { useToast } from "@/hooks/use-toast";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [users, setUsers] = useState<
    Array<{
      user: import("@/types/users").User;
      stats: { pending: number; approved: number; rejected: number };
    }>
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [overallStats, setOverallStats] = useState({
    totalRaw: 0,
    totalDone: 0,
    totalPending: 0,
  });

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      try {
        const { getAdminDashboardData } = await import("./actions");
        const { usersResult, statsResult } = await getAdminDashboardData();

        if (usersResult.success) {
          setUsers(usersResult.users);
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: usersResult.error || "Failed to load users",
          });
        }

        if (statsResult.success && statsResult.stats) {
          setOverallStats(statsResult.stats);
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: statsResult.error || "Failed to load statistics",
          });
        }
      } catch (error) {
        console.error("Failed to fetch admin data:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to connect to server",
        });
      }

      setLoading(false);
    }

    fetchData();
  }, [toast]);

  const userList = useMemo(() => users.map((u) => u.user), [users]);

  const handleReview = (userId: string) => {
    router.push(`/admin/user/${userId}`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top Navigation */}
      <TopNav />

      {/* Main Content */}
      <div className="flex flex-1 flex-col gap-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldAlert className="h-8 w-8 text-foreground" />
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => router.push("/admin/upload")}
              variant="default"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Memes
            </Button>
            <Badge variant="outline" className="text-sm">
              {userList.length} Users
            </Badge>
          </div>
        </div>

        {/* Overall Stats Section */}
        <AdminStatsSection
          totalRaw={overallStats.totalRaw}
          totalDone={overallStats.totalDone}
          totalPending={overallStats.totalPending}
        />

        {/* User Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Loading users...</p>
          </div>
        ) : (
          <UserTable
            users={userList}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onReview={handleReview}
          />
        )}
      </div>
    </div>
  );
}
