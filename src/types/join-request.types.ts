import { IUser } from "./user.types";
import { IEvent } from "./event.types";

export type JoinRequestStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

export interface IJoinRequest {
  id: string;
  userId: string;
  eventId: string;
  status: JoinRequestStatus;
  message?: string | null;
  createdAt: string;
  updatedAt: string;
  user?: IUser;
  event?: IEvent;
}

export interface ICreateJoinRequest {
  eventId: string;
  message?: string;
}

export interface IUpdateJoinRequestStatus {
  status: JoinRequestStatus;
}

export interface IJoinRequestResponse {
  success: boolean;
  message: string;
  data: IJoinRequest;
}

export interface IJoinRequestsResponse {
  success: boolean;
  message: string;
  data: IJoinRequest[];
}
