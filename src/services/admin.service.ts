import axiosInstance from "@/lib/axiosInstance";
import { IUserResponse, IUser } from "@/types/user.types";
import { IEvent } from "@/types/event.types";

export interface IAllUsersResponse {
  success: boolean;
  message: string;
  data: IUser[];
}

export interface IAllEventsResponse {
  success: boolean;
  message: string;
  data: IEvent[];
}

export interface IAdminStats {
  totalUsers: number;
  totalEvents: number;
  totalCategories: number;
  totalJoinRequests: number;
  totalRevenue: number;
  recentEvents: IEvent[];
}

export interface IAdminStatsResponse {
  success: boolean;
  message: string;
  data: IAdminStats;
}

export const adminService = {
  /**
   * Fetches all users from the system (Admin only)
   */
  getAllUsers: async (): Promise<IAllUsersResponse> => {
    const response = await axiosInstance.get<IAllUsersResponse>("users");
    return response.data;
  },

  /**
   * Updates a user's status (ACTIVE | BANNED)
   */
  updateUserStatus: async (userId: string, status: "ACTIVE" | "BANNED"): Promise<IUserResponse> => {
    const response = await axiosInstance.patch<IUserResponse>(`users/status/${userId}`, { status });
    return response.data;
  },

  /**
   * Fetches all events from the system (Admin only)
   */
  getAllEvents: async (): Promise<IAllEventsResponse> => {
    const response = await axiosInstance.get<IAllEventsResponse>("events");
    return response.data;
  },

  /**
   * Fetches admin dashboard statistics
   */
  getDashboardStats: async (): Promise<IAdminStatsResponse> => {
    const response = await axiosInstance.get<IAdminStatsResponse>("admin/stats");
    return response.data;
  },
};
