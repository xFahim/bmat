/**
 * Mock user data
 */

import { User, UserData } from "@/types/users";

/**
 * Generate deterministic mock users
 */
export const generateMockUsers = (): User[] => {
  const names = [
    "Alice Johnson",
    "Bob Smith",
    "Charlie Brown",
    "Diana Prince",
    "Ethan Hunt",
    "Fiona Chen",
    "George Wilson",
    "Hannah Martinez",
    "Isaac Newton",
    "Julia Roberts",
    "Kevin Hart",
    "Luna Park",
    "Marcus Aurelius",
    "Nina Simone",
    "Oliver Twist",
  ];

  return names.map((name, index) => {
    const pending = ((index * 7 + 13) % 100) + 1;
    const approved = ((index * 11 + 23) % 200) + 50;
    const rejected = ((index * 5 + 7) % 50);
    
    return {
      id: `user-${index + 1}`,
      name,
      email: `${name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
      avatar: `https://i.pravatar.cc/150?img=${index + 1}`,
      approved,
      rejected,
      pending,
      status: index % 10 === 0 ? "Banned" : "Active",
    };
  });
};

export const mockUserData: Record<string, UserData> = {
  "user-1": { name: "Alice Johnson", email: "alice.johnson@example.com", avatar: "https://i.pravatar.cc/150?img=1" },
  "user-2": { name: "Bob Smith", email: "bob.smith@example.com", avatar: "https://i.pravatar.cc/150?img=2" },
  "user-3": { name: "Charlie Brown", email: "charlie.brown@example.com", avatar: "https://i.pravatar.cc/150?img=3" },
  "user-4": { name: "Diana Prince", email: "diana.prince@example.com", avatar: "https://i.pravatar.cc/150?img=4" },
  "user-5": { name: "Ethan Hunt", email: "ethan.hunt@example.com", avatar: "https://i.pravatar.cc/150?img=5" },
};



















