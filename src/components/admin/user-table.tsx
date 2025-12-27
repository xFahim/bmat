/**
 * User table component with search
 */

import { useMemo } from "react";
import { User } from "@/types/users";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SearchBar } from "@/components/shared";
import { UserTableRow } from "./user-table-row";
import { filterUsers, sortUsersByPending } from "@/lib/utils/users";

interface UserTableProps {
  users: User[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onReview: (userId: string) => void;
}

export function UserTable({
  users,
  searchQuery,
  onSearchChange,
  onReview,
}: UserTableProps) {
  // Filter and sort users
  const filteredUsers = useMemo(() => {
    const filtered = filterUsers(users, searchQuery);
    return sortUsersByPending(filtered);
  }, [users, searchQuery]);

  return (
    <>
      {/* Search Bar */}
      <SearchBar
        placeholder="Search users by name or email..."
        value={searchQuery}
        onChange={onSearchChange}
      />

      {/* Table */}
      <div className="rounded-lg border border-zinc-800 overflow-hidden">
        <div className="max-h-[500px] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-800">
                <TableHead className="w-[300px]">User</TableHead>
                <TableHead className="w-[250px]">Stats</TableHead>
                <TableHead className="w-[150px]">Pending Queue</TableHead>
                <TableHead className="w-[120px]">Status</TableHead>
                <TableHead className="w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-muted-foreground"
                  >
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <UserTableRow key={user.id} user={user} onReview={onReview} />
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}


















