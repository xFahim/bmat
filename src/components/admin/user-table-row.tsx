/**
 * User table row component
 */

import { User } from "@/types/users";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { UserStatusBadge } from "@/components/shared";
import { Eye } from "lucide-react";
import {
  TableCell,
  TableRow,
} from "@/components/ui/table";

interface UserTableRowProps {
  user: User;
  onReview: (userId: string) => void;
}

export function UserTableRow({ user, onReview }: UserTableRowProps) {
  const getPerformanceStats = () => {
    const total = user.approved + user.rejected + user.pending;
    if (total === 0) {
      return <span className="text-sm text-muted-foreground">No activity</span>;
    }

    return (
      <div className="flex flex-col gap-1 min-w-[200px]">
        <div className="flex items-center gap-3 text-sm">
          <span className="text-muted-foreground">Approved:</span>
          <span className="font-medium">{user.approved}</span>
          <span className="text-muted-foreground">•</span>
          <span className="text-muted-foreground">Rejected:</span>
          <span className="font-medium">{user.rejected}</span>
        </div>
        <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-foreground/20 rounded-full transition-all"
            style={{ width: `${(user.approved / total) * 100}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <TableRow key={user.id} className="border-zinc-800">
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            {user.avatar ? (
              <AvatarImage src={user.avatar} alt={user.name} />
            ) : (
              <div className="flex items-center justify-center h-full w-full bg-muted text-muted-foreground">
                {user.name.charAt(0)}
              </div>
            )}
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{user.name}</span>
            <span className="text-sm text-muted-foreground">{user.email}</span>
          </div>
        </div>
      </TableCell>
      <TableCell>{getPerformanceStats()}</TableCell>
      <TableCell>
        <Badge variant="secondary" className="text-sm">
          {user.pending} Pending
        </Badge>
      </TableCell>
      <TableCell>
        <UserStatusBadge status={user.status} />
      </TableCell>
      <TableCell>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onReview(user.id)}
          className="gap-2"
        >
          <Eye className="h-4 w-4" />
          Review
        </Button>
      </TableCell>
    </TableRow>
  );
}












