"use client";

import { useState } from "react";
import { LayoutGrid, List, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VehicleCard } from "./vehicle-card";
import { VehicleListCard } from "./vehicle-list-card";
import type { ParsedCar } from "@/lib/vehica";

interface VehicleGridProps {
  cars: ParsedCar[];
  totalCount: number;
  perPage?: number;
}

export function VehicleGrid({ cars, totalCount, perPage = 9 }: VehicleGridProps) {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(cars.length / perPage);
  const paginatedCars = cars.slice((page - 1) * perPage, page * perPage);

  return (
    <div>
      {/* Header bar */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-semibold text-foreground">
            {Math.min((page - 1) * perPage + 1, cars.length)}–{Math.min(page * perPage, cars.length)}
          </span>{" "}
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
      {paginatedCars.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-lg font-medium">No vehicles found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your filters to see more results
          </p>
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
          {paginatedCars.map((car) => (
            <VehicleCard key={car.id} car={car} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {paginatedCars.map((car) => (
            <VehicleListCard key={car.id} car={car} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(
              (p) =>
                p === 1 || p === totalPages || Math.abs(p - page) <= 1
            )
            .map((p, idx, arr) => {
              const showEllipsis = idx > 0 && p - arr[idx - 1] > 1;
              return (
                <span key={p} className="flex items-center">
                  {showEllipsis && <span className="px-1 text-muted-foreground">...</span>}
                  <Button
                    variant={p === page ? "default" : "outline"}
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </Button>
                </span>
              );
            })}
          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
