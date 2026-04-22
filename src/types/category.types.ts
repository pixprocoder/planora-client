import { TApiResponse } from "./response.types";

export interface ICategory {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export type ICategoryResponse = TApiResponse<ICategory>;
export type ICategoriesResponse = TApiResponse<ICategory[]>;
