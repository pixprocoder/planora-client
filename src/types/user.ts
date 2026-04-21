export type Role = "ADMIN" | "USER";

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  emailVerified: boolean;
  image: string | null;
  phone: string | null;
  status: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}
