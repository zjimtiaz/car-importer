"use client";

import { useState } from "react";
import { LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VehicleCard } from "./vehicle-card";
import type { ParsedCar } from "@/lib/vehica";

interface VehicleGridProps {
  cars: ParsedCar[];
  totalCount: number;
}

export function VehicleGrid({ cars, totalCount }: VehicleGridProps) {
  const [view, setView] = useState<"grid" | "list">("grid");

  return (
    <div>
      {/* Header bar */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{cars.length}</span>{" "}
          of {totalCount} vehicles
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant={view === "grid" ? "default" : "outline"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setView("grid")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={view === "list" ? "default" : "outline"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setView("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Cars */}
      {cars.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-lg font-medium">No vehicles found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your filters to see more results
          </p>
        </div>
      ) : view === "grid" ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cars.map((car) => (
            <VehicleCard key={car.id} car={car} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {cars.map((car) => (
            <VehicleCard key={car.id} car={car} />
          ))}
        </div>
      )}
    </div>
  );
}
