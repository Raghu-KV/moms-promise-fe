import { api } from "./client";

export interface SectionSubCategory {
  _id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  categoryId: string;
  categoryName: string;
}

export interface SubCategorySection {
  _id: string;
  title: string;
  subCategories: SectionSubCategory[];
}

export const subCategorySectionsApi = {
  getAll: async (): Promise<SubCategorySection[]> => {
    const res = await api.get<{ sections: SubCategorySection[] }>(
      "/subcategory-sections",
    );
    return res.data.sections;
  },
};
