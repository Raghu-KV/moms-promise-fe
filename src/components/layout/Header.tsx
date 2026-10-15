import { categoriesApi } from "@/lib/api/categories";
import { Logo } from "./Logo";
import { DesktopSearchTrigger } from "./DesktopSearchTrigger";
import { MobileSearchTrigger } from "./MobileSearchTrigger";
import { CartIcon } from "./CartIcon";
import { AccountMenu } from "./AccountMenu";
import { MobileNav } from "./MobileNav";
import { CategoryDropdown } from "./CategoryDropdown";
import { PopNavLink } from "./PopNavLink";

// subtle tilt sequence — smaller angles than before
const TILTS = [-1.5, 1.5, -1, 1.5, -1.5, 1];

// The desktop nav shows "New Arrivals" plus this many categories, on one line.
const MAX_NAV_CATEGORIES = 5;

export async function Header() {
  const categories = await categoriesApi.getAll().catch(() => []);

  return (
    <header className="bg-white border-b border-foreground/10">
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className="flex xl:hidden items-center justify-between relative">
          <div className="flex items-center gap-2">
            <MobileNav categories={categories} />
            <Logo />
          </div>
          <div className="flex items-center gap-1">
            <MobileSearchTrigger />
            <AccountMenu />
            <CartIcon />
          </div>
        </div>

        {/* equal 1fr side columns keep the nav exactly centered. The logo is
            absolutely positioned on purpose: it hangs below the slim header
            bar instead of making the bar taller. */}
        <div className="hidden xl:grid grid-cols-[1fr_auto_1fr] items-center gap-6 relative">
          <div className="flex items-center">
            <Logo />
          </div>

          <nav className="flex items-center justify-center gap-6 whitespace-nowrap">
            <PopNavLink href="/products" rotate={TILTS[0]}>
              New Arrivals
            </PopNavLink>
            {categories.slice(0, MAX_NAV_CATEGORIES).map((cat, i) => (
              <CategoryDropdown
                key={cat._id}
                category={cat}
                rotate={TILTS[(i + 1) % TILTS.length]}
              />
            ))}
          </nav>

          <div className="flex items-center justify-end gap-1">
            <DesktopSearchTrigger />
            <AccountMenu />
            <CartIcon />
          </div>
        </div>
      </div>
    </header>
  );
}
