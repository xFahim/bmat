/**
 * Type definitions for users
 */

export type UserStatus = "Active" | "Banned";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  approved: number;
  rejected: number;
  pending: number;
  status: UserStatus;
}

export interface UserData {
  name: string;
  email: string;
  avatar?: string;
}












