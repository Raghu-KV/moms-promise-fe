import { bannersApi } from "@/lib/api/banners";
import { BannerCarousel } from "./BannerCarousel";

export async function BannerSection() {
  const banners = await bannersApi.getAll().catch(() => []);

  console.log(banners, "lopop");
  return <BannerCarousel banners={banners} />;
}
