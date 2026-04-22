import { TApiResponse } from "./response.types";

export type UserRole = "ADMIN" | "USER";
export type UserStatus = "ACTIVE" | "BANNED";

export interface IUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: UserRole;
  status: UserStatus;
  phone?: string | null;
  _count?: {
    organizedEvents: number;
    joinRequests: number;
    reviews: number;
  };
  createdAt: string;
  updatedAt: string;
}

export type IUserResponse = TApiResponse<IUser>;

export interface IUpdateProfileRequest {
  name?: string;
  phone?: string;
  image?: string | null;
}
