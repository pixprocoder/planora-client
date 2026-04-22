import axiosInstance from "@/lib/axiosInstance";
import { 
  IJoinRequestResponse, 
  IJoinRequestsResponse, 
  ICreateJoinRequest, 
  IUpdateJoinRequestStatus 
} from "@/types/join-request.types";

export const joinRequestService = {
  /**
   * Send a request to join an event
   */
  createJoinRequest: async (data: ICreateJoinRequest): Promise<IJoinRequestResponse> => {
    const response = await axiosInstance.post<IJoinRequestResponse>("join-requests", data);
    return response.data;
  },

  /**
   * Get all join requests for the currently authenticated user
   */
  getMyRequests: async (): Promise<IJoinRequestsResponse> => {
    const response = await axiosInstance.get<IJoinRequestsResponse>("join-requests/my-requests");
    return response.data;
  },

  /**
   * Get join requests for a specific event (Organizers)
   */
  getEventRequests: async (eventId: string): Promise<IJoinRequestsResponse> => {
    const response = await axiosInstance.get<IJoinRequestsResponse>(`join-requests/event/${eventId}`);
    return response.data;
  },

  /**
   * Get all join requests for events organized by the current user (Organizers)
   */
  getOrganizerAllRequests: async (): Promise<IJoinRequestsResponse> => {
    const response = await axiosInstance.get<IJoinRequestsResponse>("join-requests/organizer/all");
    return response.data;
  },

  /**
   * Update the status of a join request (Organizers)
   */
  updateRequestStatus: async (requestId: string, status: IUpdateJoinRequestStatus): Promise<IJoinRequestResponse> => {
    const response = await axiosInstance.patch<IJoinRequestResponse>(`join-requests/${requestId}/status`, status);
    return response.data;
  }
};
