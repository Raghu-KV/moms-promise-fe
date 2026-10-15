import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { productsApi } from "@/lib/api/products";
import { childCategoriesApi } from "@/lib/api/childCategories";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ChildCategoryGrid } from "@/components/product/ChildCategoryGrid";
import { FilterSidebar } from "@/components/filters/FilterSidebar";
import { SortDropdown } from "@/components/filters/SortDropdown";
import { Pagination } from "@/components/ui/Pagination";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop | moms-promise Kids Apparel",
};

interface PageProps {
  searchParams: Promise<Record<string, string>>;
}

export default async function AllProductsPage({ searchParams }: PageProps) {
  const sp = await searchParams;

  // A subcategory with active child categories shows them first. Picking one
  // (childCategoryId) or "View all" (all=1) moves on to the products.
  const childCategories =
    sp.subCategoryId && !sp.childCategoryId && !sp.all
      ? await childCategoriesApi
          .getBySubCategory(sp.subCategoryId)
          .catch(() => [])
      : [];

  if (childCategories.length > 0 && sp.subCategoryId) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-3xl text-primary mb-6">
          {sp.subCategory || sp.category || "Shop"}
        </h1>
        <ChildCategoryGrid
          childCategories={childCategories}
          categoryId={sp.categoryId}
          categoryName={sp.category}
          subCategoryId={sp.subCategoryId}
          subCategoryName={sp.subCategory}
        />
      </main>
    );
  }

  const data = await productsApi.list({
    categoryId: sp.categoryId,
    subCategoryId: sp.subCategoryId,
    childCategoryId: sp.childCategoryId,
    age: sp.age,
    color: sp.color,
    minPrice: sp.minPrice,
    maxPrice: sp.maxPrice,
    availability: sp.availability,
    page: sp.page || "1",
  });

  // display-only labels passed through the URL — not used for filtering
  const heading =
    sp.childCategory || sp.subCategory || sp.category || "Shop All";

  // Back to the child-category tiles when we got here through them
  const backToChildCategories =
    sp.subCategoryId && (sp.childCategoryId || sp.all)
      ? `/products?${new URLSearchParams({
          ...(sp.categoryId && { categoryId: sp.categoryId }),
          subCategoryId: sp.subCategoryId,
          ...(sp.category && { category: sp.category }),
          ...(sp.subCategory && { subCategory: sp.subCategory }),
        }).toString()}`
      : null;

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      {backToChildCategories && (
        <Link
          href={backToChildCategories}
          className="mb-2 inline-flex items-center gap-1 text-sm text-foreground/60 hover:text-primary"
        >
          <ChevronLeft size={16} />
          {sp.subCategory || "Back"}
        </Link>
      )}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl text-primary">{heading}</h1>
        {/* <SortDropdown /> */}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <FilterSidebar />
        <div className="flex-1">
          <p className="text-sm text-foreground/60 mb-4">
            {data.total} products
          </p>
          <ProductGrid products={data.products} />
          <Pagination
            page={data.page}
            totalPages={data.totalPages}
            hasNextPage={data.hasNextPage}
            hasPrevPage={data.hasPrevPage}
          />
        </div>
      </div>
    </main>
  );
}
