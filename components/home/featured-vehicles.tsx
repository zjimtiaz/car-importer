import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VehicleCard } from "@/components/cars/vehicle-card";
import type { ParsedCar } from "@/lib/vehica";

interface FeaturedVehiclesProps {
  cars: ParsedCar[];
}

export function FeaturedVehicles({ cars }: FeaturedVehiclesProps) {
  if (cars.length === 0) return null;

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8 flex items-end justify-between">
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

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cars.slice(0, 8).map((car) => (
            <VehicleCard key={car.id} car={car} />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Button asChild>
            <Link href="/vehicles">View All Cars</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
