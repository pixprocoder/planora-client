import { TApiResponse } from "./response.types";

export interface IReview {
  id: string;
  eventId: string;
  userId: string;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
  user: {
    name: string;
    image?: string | null;
  };
}

export type IReviewResponse = TApiResponse<IReview>;
export type IReviewsResponse = TApiResponse<IReview[]>;

export interface ICreateReviewRequest {
  eventId: string;
  rating: number;
  comment?: string;
}
