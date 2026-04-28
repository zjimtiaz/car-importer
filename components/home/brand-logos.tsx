"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import type { VehicaTaxonomyTerm } from "@/lib/vehica";

interface BrandLogosProps {
  makes: VehicaTaxonomyTerm[];
}

export function BrandLogos({ makes }: BrandLogosProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 2,
    containScroll: "trimSnaps",
    breakpoints: {
      "(min-width: 1024px)": { slidesToScroll: 3 },
    },
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  if (makes.length === 0) return null;

  return (
    <section className="border-y bg-card py-10">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Browse by Brand
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={scrollPrev}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={scrollNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4">
            {makes.map((make) => (
              <Link
                key={make.id}
                href={`/vehicles/${make.slug}`}
                className="flex min-w-0 shrink-0 basis-[120px] flex-col items-center gap-1 rounded-lg px-4 py-3 transition-colors hover:bg-muted sm:basis-[140px] md:basis-[calc(20%-13px)]"
              >
                <span className="whitespace-nowrap text-xl font-bold text-foreground/80 md:text-2xl">
                  {make.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {make.count} {make.count === 1 ? "car" : "cars"}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
