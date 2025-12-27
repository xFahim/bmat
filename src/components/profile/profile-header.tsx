/**
 * Profile header component
 * Displays user avatar, name, and email
 */

import { Avatar, AvatarImage } from "@/components/ui/avatar";

interface ProfileHeaderProps {
  avatarUrl: string | null;
  name: string;
  email: string;
}

export function ProfileHeader({
  avatarUrl,
  name,
  email,
}: ProfileHeaderProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex items-center gap-4 pb-6">
      <Avatar className="h-20 w-20">
        {avatarUrl ? (
          <AvatarImage src={avatarUrl} alt={name} />
        ) : (
          <span className="text-2xl font-medium text-foreground">
            {initials || "U"}
          </span>
        )}
      </Avatar>
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold">{name || "User"}</h1>
        <p className="text-sm text-muted-foreground">{email}</p>
      </div>
    </div>
  );
}

















