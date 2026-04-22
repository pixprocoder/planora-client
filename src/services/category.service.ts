import axiosInstance from "@/lib/axiosInstance";
import { ICategoriesResponse, ICategoryResponse } from "@/types/category.types";

export const categoryService = {
  /**
   * Fetches all event categories
   */
  getAllCategories: async (): Promise<ICategoriesResponse> => {
    const response = await axiosInstance.get<ICategoriesResponse>("categories");
    return response.data;
  },

  /**
   * Creates a new event category (Admin only)
   */
  createCategory: async (name: string): Promise<ICategoryResponse> => {
    const response = await axiosInstance.post<ICategoryResponse>("categories", { name });
    return response.data;
  },

  /**
   * Deletes an event category (Admin only)
   */
  deleteCategory: async (id: string): Promise<ICategoryResponse> => {
    const response = await axiosInstance.delete<ICategoryResponse>(`categories/${id}`);
    return response.data;
  },
};
