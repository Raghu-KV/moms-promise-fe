"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { optimizedImageUrl } from "@/lib/utils/cloudinary";
import { kpiImagesApi } from "@/lib/api/kpiImages";
import type { KpiImage } from "@/lib/api/kpiImages";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function KpiTile({ image }: { image: KpiImage }) {
  const tile = (
    <div className="kpi-tile relative aspect-8/5 w-full overflow-hidden rounded-card">
      <Image
        src={optimizedImageUrl(image.imageUrl)}
        alt={image.title || "moms-promise"}
        fill
        sizes="(min-width: 1024px) 23vw, (min-width: 640px) 45vw, 90vw"
        className="object-contain"
      />
    </div>
  );

  return image.linkUrl ? (
    <Link
      href={image.linkUrl}
      className="block transition-transform duration-200 hover:scale-[1.02]"
    >
      {tile}
    </Link>
  ) : (
    tile
  );
}

export function KpiSection() {
  const [images, setImages] = useState<KpiImage[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    kpiImagesApi
      .getAll()
      .then(setImages)
      .catch(() => setImages([]));
  }, []);

  useEffect(() => {
    if (images.length === 0 || !containerRef.current) return;

    // Target by class rather than direct children — the layout below
    // nests tiles differently depending on how many there are (single
    // tile, a centered pair, a tile-then-pair), so this keeps every
    // individual tile animating regardless of that structure.
    const tiles = containerRef.current.querySelectorAll(".kpi-tile");
    gsap.fromTo(
      tiles,
      { y: 24, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
        },
      },
    );
  }, [images]);

  if (images.length === 0) return null;

  return (
    <section className="py-14">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-2xl md:text-4xl text-foreground text-center mb-10">
          Our Impact
        </h2>

        <div ref={containerRef}>
          {images.length === 1 && (
            <div className="flex justify-center">
              <div className="w-full max-w-xs sm:max-w-sm">
                <KpiTile image={images[0]} />
              </div>
            </div>
          )}

          {images.length === 2 && (
            <div className="grid grid-cols-2 gap-4 md:gap-6 max-w-md sm:max-w-xl mx-auto">
              <KpiTile image={images[0]} />
              <KpiTile image={images[1]} />
            </div>
          )}

          {images.length === 3 && (
            // flex-wrap centers each line on its own — 2 tiles fit per row on
            // mobile (so the 3rd wraps to its own, automatically-centered
            // row below), while sm:+ widens each tile just enough for all 3
            // to sit on one centered row instead. Every tile uses the same
            // width formula, so all three stay the same size throughout.
            <div className="flex flex-wrap justify-center gap-4">
              {images.map((image) => (
                <div
                  key={image._id}
                  className="w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-0.75rem)]"
                >
                  <KpiTile image={image} />
                </div>
              ))}
            </div>
          )}

          {images.length >= 4 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {images.map((image) => (
                <KpiTile key={image._id} image={image} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
