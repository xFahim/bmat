/**
 * User header component for review page
 */

import { UserData } from "@/types/users";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Ban, ArrowLeft } from "lucide-react";

interface UserHeaderProps {
  user: UserData;
  pendingCount: number;
  onBack: () => void;
  onBan: () => void;
  isBanning?: boolean;
}

export function UserHeader({
  user,
  pendingCount,
  onBack,
  onBan,
  isBanning = false,
}: UserHeaderProps) {
  return (
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            {user.avatar ? (
              <AvatarImage src={user.avatar} alt={user.name} />
            ) : (
              <div className="flex items-center justify-center h-full w-full bg-muted text-muted-foreground">
                {user.name.charAt(0)}
              </div>
            )}
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Badge variant="secondary" className="text-sm">
          Pending: {pendingCount}
        </Badge>
        <Button
          variant="outline"
          onClick={onBan}
          disabled={isBanning}
          className="gap-2"
        >
          <Ban className="h-4 w-4" />
          {isBanning ? "Banning..." : "Ban User"}
        </Button>
      </div>
    </div>
  );
}

