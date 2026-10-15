import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { optimizedImageUrl } from "@/lib/utils/cloudinary";
import type { ChildCategory } from "@/lib/api/childCategories";

interface ChildCategoryGridProps {
  childCategories: ChildCategory[];
  categoryId?: string;
  categoryName?: string;
  subCategoryId: string;
  subCategoryName?: string;
}

// The layer between a subcategory and its products: pick a child category to
// see its products, or skip straight to everything in the subcategory.
export function ChildCategoryGrid({
  childCategories,
  categoryId,
  categoryName,
  subCategoryId,
  subCategoryName,
}: ChildCategoryGridProps) {
  const base = new URLSearchParams();
  if (categoryId) base.set("categoryId", categoryId);
  base.set("subCategoryId", subCategoryId);
  if (categoryName) base.set("category", categoryName);
  if (subCategoryName) base.set("subCategory", subCategoryName);

  const hrefFor = (extra: Record<string, string>) => {
    const params = new URLSearchParams(base);
    for (const [key, value] of Object.entries(extra)) params.set(key, value);
    return `/products?${params.toString()}`;
  };

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
        {childCategories.map((child) => (
          <Link
            key={child._id}
            href={hrefFor({
              childCategoryId: child._id,
              childCategory: child.name,
            })}
            className="group flex flex-col overflow-hidden rounded-card border border-foreground/15 bg-white"
          >
            <div className="relative aspect-square w-full overflow-hidden">
              {child.imageUrl ? (
                <Image
                  src={optimizedImageUrl(child.imageUrl)}
                  alt={child.name}
                  fill
                  sizes="(min-width: 1024px) 300px, (min-width: 768px) 33vw, 50vw"
                  className="object-cover transition-transform duration-300 ease-out group-hover:scale-110"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-foreground/5 text-sm text-foreground/30">
                  {child.name}
                </div>
              )}
            </div>
            <span className="flex items-center justify-between gap-2 px-3 py-3 text-sm md:text-base font-medium text-foreground group-hover:text-primary transition-colors">
              {child.name}
              <ArrowRight
                size={18}
                className="shrink-0 transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link
          href={hrefFor({ all: "1" })}
          className="text-sm font-semibold text-primary hover:underline"
        >
          View all {subCategoryName ?? "products"}
        </Link>
      </div>
    </div>
  );
}
