import { TApiResponse } from "./response.types";

export type EventVisibility = "PUBLIC" | "PRIVATE";

export interface IEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  visibility: EventVisibility;
  fee: number;
  organizerId: string;
  categoryId?: string | null;
  organizer?: {
    id: string;
    name: string;
    email: string;
  };
  category?: {
    id: string;
    name: string;
  };
  image?: string | null;
  _count?: {
    requests: number;
    reviews: number;
  };
  capacity: number;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateEventRequest {
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  visibility?: EventVisibility;
  fee?: number;
  categoryId?: string | null;
}

export type IEventResponse = TApiResponse<IEvent>;
export type IEventsResponse = TApiResponse<IEvent[]>;
