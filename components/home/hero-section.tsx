"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ParsedCar } from "@/lib/vehica";

interface HeroSectionProps {
  cars: ParsedCar[];
}

export function HeroSection({ cars }: HeroSectionProps) {
  const slides = cars.slice(0, 4);
  const [active, setActive] = useState(0);

  const next = useCallback(
    () => setActive((i) => (i + 1) % slides.length),
    [slides.length]
  );
  const prev = useCallback(
    () => setActive((i) => (i === 0 ? slides.length - 1 : i - 1)),
    [slides.length]
  );

  // Auto-play
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, slides.length]);

  const car = slides[active];

  return (
    <section className="relative h-[520px] overflow-hidden bg-[hsl(222,47%,11%)] text-white md:h-[600px]">
      {/* Background images */}
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === active ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={slide.mainImage}
            alt={slide.name}
            fill
            className="object-cover"
            priority={i === 0}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-6">
        <div className="max-w-xl">
          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            Premium Imported Vehicles
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            Find Your Perfect{" "}
            <span className="text-primary">Imported Car</span>
          </h1>

          {car && (
            <div className="mt-4 flex items-center gap-3 text-gray-300">
              <span className="rounded bg-white/10 px-2.5 py-1 text-sm font-medium backdrop-blur-sm">
                {car.make} {car.model}
              </span>
              {car.year && (
                <span className="text-sm">{car.year}</span>
              )}
              {car.priceDisplay && (
                <span className="text-lg font-bold text-primary">
                  {car.priceDisplay}
                </span>
              )}
            </div>
          )}

          <p className="mt-4 text-base text-gray-300 md:text-lg">
            Browse our curated selection and drive home your dream car today.
            Quality assured with UK-wide delivery.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Button size="lg" asChild>
              <Link href="/vehicles">
                Browse All Cars
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10"
              asChild
            >
              <Link href="/contact">Get In Touch</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/40 p-2.5 text-white backdrop-blur-sm transition hover:bg-black/60"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/40 p-2.5 text-white backdrop-blur-sm transition hover:bg-black/60"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`h-2 rounded-full transition-all ${
                  i === active
                    ? "w-8 bg-primary"
                    : "w-2 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
