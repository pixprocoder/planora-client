import axiosInstance from "@/lib/axiosInstance";
import { 
  IReviewResponse, 
  IReviewsResponse, 
  ICreateReviewRequest 
} from "@/types/review.types";

export const reviewService = {
  /**
   * Submit a review for an event
   */
  createReview: async (data: ICreateReviewRequest): Promise<IReviewResponse> => {
    const response = await axiosInstance.post<IReviewResponse>("reviews", data);
    return response.data;
  },

  /**
   * Get all reviews for a specific event
   */
  getEventReviews: async (eventId: string): Promise<IReviewsResponse> => {
    const response = await axiosInstance.get<IReviewsResponse>(`reviews/event/${eventId}`);
    return response.data;
  },

  /**
   * Delete a review (Owner or Admin)
   */
  deleteReview: async (reviewId: string): Promise<IReviewResponse> => {
    const response = await axiosInstance.delete<IReviewResponse>(`reviews/${reviewId}`);
    return response.data;
  },
};
