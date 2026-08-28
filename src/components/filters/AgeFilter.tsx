"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { FilterSection } from "./FilterSection";

const AGE_GROUPS = ["2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9", "9-10"];

export function AgeFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeAge = searchParams.get("age");

  const toggle = (age: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (activeAge === age) params.delete("age");
    else params.set("age", age);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <FilterSection title="Age">
      <div className="grid grid-cols-2 gap-2">
        {AGE_GROUPS.map((age) => (
          <button
            key={age}
            onClick={() => toggle(age)}
            className={`rounded-chip border-2 px-3 py-1.5 text-xs font-medium transition-all ${
              activeAge === age
                ? "border-primary bg-primary/10 text-primary"
                : "border-foreground/15 text-foreground hover:border-primary/40"
            }`}
          >
            {age} yrs
          </button>
        ))}
      </div>
    </FilterSection>
  );
}
