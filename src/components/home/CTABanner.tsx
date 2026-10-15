"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export function CTABanner() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const eagleRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    gsap.fromTo(
      contentRef.current,
      { x: 40, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      },
    );

    gsap.fromTo(
      eagleRef.current,
      { x: -40, y: 30, opacity: 0 },
      {
        x: 0,
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "back.out(1.4)",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      },
    );
  }, []);

  return (
    <section ref={sectionRef} className="mx-auto max-w-7xl px-4 py-10 md:py-16">
      <div className="relative md:mt-10">
        {/* the card itself — overflow-hidden clips only its own background decoration */}
        <div className="relative overflow-hidden rounded-card border-2 border-highlight/40 bg-highlight/20 px-8 py-12 md:py-8 md:pl-56 flex flex-col md:flex-row-reverse items-center justify-between gap-8">
          {/* decorative blobs */}
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/40 translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-32 w-56 h-56 rounded-full bg-white/50 translate-y-1/2 pointer-events-none" />
          <div className="absolute top-1/2 left-0 w-72 h-72 rounded-full bg-white/30 -translate-x-1/3 -translate-y-1/2 pointer-events-none" />

          {/* content — right */}
          <div
            ref={contentRef}
            className="relative z-10 flex flex-col items-start gap-5 max-w-lg"
          >
            <h2 className="text-3xl md:text-5xl text-primary leading-tight">
              Dress them for every
              <br />
              adventure.
            </h2>
            <p className="text-sm md:text-base text-foreground/70 leading-relaxed">
              From first steps to big-kid energy — moms-promise has playful, durable
              apparel for every stage. Explore our full collection and find the
              perfect fit for your little one.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/products"
                className="flex items-center gap-2 rounded-chip bg-primary px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                Shop all products <ArrowRight size={16} />
              </Link>
              <Link
                href="/products?availability=in_stock"
                className="flex items-center gap-2 rounded-chip border-2 border-primary/40 px-6 py-3 text-sm font-semibold text-primary hover:border-primary transition-colors"
              >
                In stock now
              </Link>
            </div>
          </div>
        </div>

        {/* eagle mascot — sibling of the card, so it can overflow past its edge; now on the left */}
        <div
          ref={eagleRef}
          className="hidden md:block absolute z-20 bottom-0 left-6 lg:left-48 w-48 lg:w-74 pointer-events-none"
        >
          <Image
            src="/girl2.png"
            alt="moms-promise eagle mascot"
            width={1024}
            height={1536}
            className="w-280 h-full object-contain-translate-y-6 lg:-translate-y-12"
          />
        </div>
      </div>
    </section>
  );
}
