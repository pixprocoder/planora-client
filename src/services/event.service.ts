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
      await axiosInstance.get<ICategoriesResponse>("/categories");
    return data;
  },

  getAllEvents: async (): Promise<IEventsResponse> => {
    const { data } = await axiosInstance.get<IEventsResponse>("/events");
    return data;
  },

  getEventById: async (id: string): Promise<IEventResponse> => {
    const { data } = await axiosInstance.get<IEventResponse>(`/events/${id}`);
    return data;
  },

  createEvent: async (
    eventData: ICreateEventRequest,
  ): Promise<IEventResponse> => {
    const { data } = await axiosInstance.post<IEventResponse>(
      "/events",
      eventData,
    );
    return data;
  },

  updateEvent: async (
    id: string,
    eventData: Partial<ICreateEventRequest>,
  ): Promise<IEventResponse> => {
    const { data } = await axiosInstance.patch<IEventResponse>(
      `/events/${id}`,
      eventData,
    );
    return data;
  },

  deleteEvent: async (
    id: string,
  ): Promise<{ success: boolean; message: string }> => {
    const { data } = await axiosInstance.delete(`/events/${id}`);
    return data;
  },
};
