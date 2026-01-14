/**
 * Utility functions for users
 */

import { User } from "@/types/users";

/**
 * Filter users based on search query
 */
export const filterUsers = (users: User[], searchQuery: string): User[] => {
  if (!searchQuery.trim()) {
    return users;
  }
  const query = searchQuery.toLowerCase();
  return users.filter(
    (user) =>
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
  );
};

/**
 * Calculate overall statistics from users
 */
export const calculateOverallStats = (users: User[]) => {
  const totalRaw = users.reduce(
    (sum, user) => sum + user.pending + user.approved + user.rejected,
    0
  );
  const totalDone = users.reduce(
    (sum, user) => sum + user.approved + user.rejected,
    0
  );
  const totalPending = users.reduce((sum, user) => sum + user.pending, 0);
  return { totalRaw, totalDone, totalPending };
};

/**
 * Sort users by pending queue (descending)
 */
export const sortUsersByPending = (users: User[]): User[] => {
  return [...users].sort((a, b) => b.pending - a.pending);
};



















