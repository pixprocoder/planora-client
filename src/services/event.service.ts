import axiosInstance from "@/lib/axiosInstance";
import { ICategoriesResponse } from "@/types/category.types";
import {
  ICreateEventRequest,
  IEventResponse,
  IEventsResponse,
} from "@/types/event.types";

export const eventService = {
  getAllCategories: async (): Promise<ICategoriesResponse> => {
    const { data } =
      await axiosInstance.get<ICategoriesResponse>("categories");
    return data;
  },

  /**
   * Fetches all public events. Supports optional query parameters for filtering.
   */
  getAllEvents: async (params?: Record<string, string | number | boolean | undefined>): Promise<IEventsResponse> => {
    const response = await axiosInstance.get<IEventsResponse>("events", { params });
    return response.data;
  },

  /**
   * Fetches a single public event by its ID
   */
  getEventById: async (id: string): Promise<IEventResponse> => {
    const response = await axiosInstance.get<IEventResponse>(`events/${id}`);
    return response.data;
  },

  /**
   * Fetches events created by the currently authenticated user
   */
  getMyEvents: async (): Promise<IEventsResponse> => {
    const { data } =
      await axiosInstance.get<IEventsResponse>("events/my-events");
    return data;
  },

  createEvent: async (
    eventData: ICreateEventRequest,
  ): Promise<IEventResponse> => {
    const { data } = await axiosInstance.post<IEventResponse>(
      "events",
      eventData,
    );
    return data;
  },

  updateEvent: async (
    id: string,
    eventData: Partial<ICreateEventRequest>,
  ): Promise<IEventResponse> => {
    const { data } = await axiosInstance.patch<IEventResponse>(
      `events/${id}`,
      eventData,
    );
    return data;
  },

  deleteEvent: async (
    id: string,
  ): Promise<{ success: boolean; message: string }> => {
    const { data } = await axiosInstance.delete(`events/${id}`);
    return data;
  },
};
