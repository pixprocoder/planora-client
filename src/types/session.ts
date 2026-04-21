import { IUser } from "./user";

export interface ISession {
  id: string;
  token: string;
  userId: string;
  expiresAt: Date | string;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  user: IUser;
}
