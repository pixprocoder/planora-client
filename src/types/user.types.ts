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
  createdAt: string;
  updatedAt: string;
}

export interface IUserResponse {
  success: boolean;
  message: string;
  data: IUser;
}

export interface IUpdateProfileRequest {
  name?: string;
  phone?: string;
  image?: string | null;
}
