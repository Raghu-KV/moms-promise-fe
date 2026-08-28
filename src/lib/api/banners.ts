import { api } from "./client";

export interface Banner {
  _id: string;
  imageUrl: string;
  linkUrl?: string;
  title?: string;
  sortOrder: number;
  status: "active" | "inactive";
}

export const bannersApi = {
  getAll: async (): Promise<Banner[]> => {
    const res = await api.get<{ banners: Banner[] }>("/banners");
    return res.data.banners;
  },
};
