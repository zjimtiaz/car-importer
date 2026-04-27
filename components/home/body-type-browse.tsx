"use client";

import Link from "next/link";
import { Car, Truck, Bike, Bus, ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import type { VehicaTaxonomyTerm } from "@/lib/vehica";

interface BodyTypeBrowseProps {
  bodyTypes: VehicaTaxonomyTerm[];
}

// Map body type slugs to icons
const iconMap: Record<string, typeof Car> = {
  sedan: Car,
  suv: Truck,
  hatchback: Car,
  coupe: Car,
  convertible: Car,
  wagon: Bus,
  van: Bus,
  truck: Truck,
  motorcycle: Bike,
};

export function BodyTypeBrowse({ bodyTypes }: BodyTypeBrowseProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 1,
    containScroll: "trimSnaps",
    breakpoints: {
      "(min-width: 1024px)": { slidesToScroll: 2 },
    },
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  if (bodyTypes.length === 0) return null;

  return (
    <section className="bg-muted/50 py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">
              Popular Car Makes &amp; Body Types
            </h2>
            <p className="mt-1 text-muted-foreground">
              Find the perfect style for your needs
            </p>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-full"
              onClick={scrollPrev}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-full"
              onClick={scrollNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4">
            {bodyTypes.map((bt) => {
              const Icon = iconMap[bt.slug] || Car;
              return (
                <Link
                  key={bt.id}
                  href={`/vehicles?bodyType=${bt.slug}`}
                  className="flex min-w-0 shrink-0 basis-[140px] flex-col items-center gap-3 rounded-lg border bg-card p-6 text-center transition-colors hover:border-primary hover:bg-primary/5 sm:basis-[160px] md:basis-[calc(25%-12px)] lg:basis-[calc(16.666%-14px)]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-medium">{bt.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {bt.count} {bt.count === 1 ? "car" : "cars"}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
