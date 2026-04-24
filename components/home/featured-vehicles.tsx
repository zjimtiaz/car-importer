"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VehicleCard } from "@/components/cars/vehicle-card";
import type { ParsedCar } from "@/lib/vehica";

interface FeaturedVehiclesProps {
  cars: ParsedCar[];
}

export function FeaturedVehicles({ cars }: FeaturedVehiclesProps) {
  const [activeTab, setActiveTab] = useState("all");

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
          <Button variant="ghost" asChild className="hidden sm:flex">
            <Link href="/vehicles">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Body type tabs */}
        {bodyTypes.length > 1 && (
          <div className="mb-6 flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab("all")}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
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
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
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

        <div className="grid gap-6 grid-cols-2 lg:grid-cols-4">
          {filteredCars.slice(0, 8).map((car) => (
            <VehicleCard key={car.id} car={car} />
          ))}
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
