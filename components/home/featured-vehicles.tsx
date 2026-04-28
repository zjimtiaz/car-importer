"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@/components/ui/button";
import { VehicleCard } from "@/components/cars/vehicle-card";
import type { ParsedCar } from "@/lib/vehica";

interface FeaturedVehiclesProps {
  cars: ParsedCar[];
}

export function FeaturedVehicles({ cars }: FeaturedVehiclesProps) {
  const [activeTab, setActiveTab] = useState("all");

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

  // Get unique body types from the cars
  const bodyTypes = useMemo(() => {
    const types = new Set<string>();
    cars.forEach((car) => {
      if (car.bodyType) types.add(car.bodyType);
    });
    return Array.from(types);
  }, [cars]);

  // Filter cars by selected body type
  const filteredCars = useMemo(() => {
    if (activeTab === "all") return cars;
    return cars.filter(
      (car) => car.bodyType?.toLowerCase() === activeTab.toLowerCase()
    );
  }, [cars, activeTab]);

  if (cars.length === 0) return null;

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">Featured Vehicles</h2>
            <p className="mt-1 text-muted-foreground">
              Hand-picked cars for the best value
            </p>
          </div>
          <div className="flex items-center gap-2">
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
            <Button variant="ghost" asChild className="hidden sm:flex">
              <Link href="/vehicles">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Body type tabs */}
        {bodyTypes.length > 1 && (
          <div className="mb-6 flex gap-2 overflow-x-auto no-scrollbar pb-1">
            <button
              onClick={() => setActiveTab("all")}
              className={`shrink-0 whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                activeTab === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              All Cars
            </button>
            {bodyTypes.map((type) => (
              <button
                key={type}
                onClick={() => setActiveTab(type)}
                className={`shrink-0 whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  activeTab.toLowerCase() === type.toLowerCase()
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        )}

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4">
            {filteredCars.map((car) => (
              <div
                key={car.id}
                className="min-w-0 shrink-0 basis-[75%] sm:basis-[48%] lg:basis-[calc(25%-12px)]"
              >
                <VehicleCard car={car} />
              </div>
            ))}
          </div>
        </div>

        {filteredCars.length === 0 && (
          <p className="py-12 text-center text-muted-foreground">
            No featured vehicles in this category
          </p>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Button asChild>
            <Link href="/vehicles">View All Cars</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
