"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { RoughNotation } from "react-rough-notation";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const AGE_GROUPS = [
  { label: "2-3 yrs", value: "2-3", rotate: -3 },
  { label: "3-4 yrs", value: "3-4", rotate: 2 },
  { label: "4-5 yrs", value: "4-5", rotate: -2 },
  { label: "5-6 yrs", value: "5-6", rotate: 3 },
  { label: "6-7 yrs", value: "6-7", rotate: -3 },
  { label: "7-8 yrs", value: "7-8", rotate: 2 },
  { label: "8-9 yrs", value: "8-9", rotate: -2 },
  { label: "9-10 yrs", value: "9-10", rotate: 3 },
];

// cycle through theme colors for a playful, varied look
const CHIP_COLORS = [
  "bg-primary/10 border-primary/30 group-hover:border-primary group-hover:bg-primary/15",
  "bg-accent/10 border-accent/30 group-hover:border-accent group-hover:bg-accent/15",
  "bg-highlight/20 border-highlight/40 group-hover:border-highlight group-hover:bg-highlight/25",
];

export function ShopByAge() {
  const [show, setShow] = useState(false);
  const [activeChip, setActiveChip] = useState<string | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 300);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const chips = document.querySelectorAll(".age-chip");
    if (!chips.length) return;

    gsap.fromTo(
      chips,
      { opacity: 0, y: 24, scale: 0.85, rotate: 0 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        rotate: (i) => AGE_GROUPS[i].rotate,
        duration: 0.5,
        stagger: 0.06,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: ".age-chips-container",
          start: "top 85%",
        },
      },
    );
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <h2 className="text-2xl md:text-4xl text-primary text-center mb-8">
        <RoughNotation
          type="underline"
          show={show}
          color="var(--color-highlight)"
          strokeWidth={isMobile ? 2 : 3}
          animationDuration={600}
          brackets={["left", "right"]}
        >
          Shop by Age
        </RoughNotation>
      </h2>

      <div className="age-chips-container flex flex-wrap justify-center gap-4 md:gap-5">
        {AGE_GROUPS.map((age, i) => (
          <Link
            key={age.value}
            href={`/products?age=${age.value}`}
            className="age-chip group flex flex-col items-center gap-2"
            style={{ transform: `rotate(${age.rotate}deg)` }}
            onMouseEnter={() => setActiveChip(age.value)}
            onMouseLeave={() => setActiveChip(null)}
          >
            <div
              className={`flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl border-2 transition-all duration-200 group-hover:-translate-y-1 group-hover:rotate-0 ${CHIP_COLORS[i % CHIP_COLORS.length]}`}
            >
              <span className="text-lg md:text-xl font-black text-foreground group-hover:text-primary transition-colors tracking-tight">
                <RoughNotation
                  type="circle"
                  show={activeChip === age.value}
                  color="var(--color-accent)"
                  strokeWidth={2}
                  padding={6}
                  animationDuration={400}
                >
                  {age.value}
                </RoughNotation>
              </span>
            </div>
            <span className="text-xs md:text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
              {age.label.replace(" yrs", "")}
              <span className="text-foreground/50"> yrs</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
