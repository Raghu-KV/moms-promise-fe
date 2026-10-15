import { api } from "./client";

export interface ChildCategory {
  _id: string;
  subCategoryId: string;
  name: string;
  slug: string;
  imageUrl?: string;
  status: "active" | "inactive";
}

export const childCategoriesApi = {
  // Active child categories of one subcategory, empty when it has none
  getBySubCategory: async (subCategoryId: string): Promise<ChildCategory[]> => {
    const res = await api.get<{ childCategories: ChildCategory[] }>(
      "/child-categories",
      { params: { subCategoryId } },
    );
    return res.data.childCategories;
  },
};
