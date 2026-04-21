export interface ICategory {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICategoriesResponse {
  success: boolean;
  message: string;
  data: ICategory[];
}
