import Link from "next/link";
import Image from "next/image";
import { optimizedImageUrl } from "@/lib/utils/cloudinary";
import { subCategorySectionsApi } from "@/lib/api/subCategorySections";

// Admin-managed blocks: a title plus a grid of subcategory image tiles.
// Renders nothing until at least one active section exists.
export async function SubCategorySections() {
  const sections = await subCategorySectionsApi.getAll().catch(() => []);
  if (sections.length === 0) return null;

  return (
    <>
      {sections.map((section) => (
        <section key={section._id} className="py-10">
          <div className="mx-auto max-w-7xl px-4">
            <h2 className="text-3xl md:text-5xl font-bold text-logo-pink text-center mb-8">
              {section.title}
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-5">
              {section.subCategories.map((sub) => (
                <Link
                  key={sub._id}
                  href={`/products?categoryId=${sub.categoryId}&subCategoryId=${sub._id}&category=${encodeURIComponent(sub.categoryName)}&subCategory=${encodeURIComponent(sub.name)}`}
                  className="group flex flex-col overflow-hidden rounded-card border border-foreground/15 bg-white"
                >
                  <div className="relative aspect-square w-full overflow-hidden">
                    {sub.imageUrl ? (
                      <Image
                        src={optimizedImageUrl(sub.imageUrl)}
                        alt={sub.name}
                        fill
                        sizes="(min-width: 1024px) 16vw, (min-width: 640px) 30vw, 45vw"
                        className="object-cover transition-transform duration-300 ease-out group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-foreground/5 text-sm text-foreground/30">
                        {sub.name}
                      </div>
                    )}
                  </div>
                  <span className="px-3 py-3 text-center text-sm md:text-base font-medium text-foreground">
                    {sub.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
