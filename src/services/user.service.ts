import axiosInstance from "@/lib/axiosInstance";
import { IUpdateProfileRequest, IUserResponse } from "@/types/user.types";

export const userService = {
  /**
   * Fetches the currently authenticated user's profile from /users/me
   */
  getMyProfile: async (): Promise<IUserResponse> => {
    const response = await axiosInstance.get<IUserResponse>("/users/me");
    return response.data;
  },

  /**
   * Updates the current user's profile fields
   * @param data - { name?, phone?, image? }
   */
  updateProfile: async (data: IUpdateProfileRequest): Promise<IUserResponse> => {
    const response = await axiosInstance.patch<IUserResponse>("/users/profile", data);
    return response.data;
  },
};
