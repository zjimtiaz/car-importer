"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { VehicaTaxonomyTerm } from "@/lib/vehica";

interface FilterSidebarProps {
  makes: VehicaTaxonomyTerm[];
  models: VehicaTaxonomyTerm[];
  bodyTypes: VehicaTaxonomyTerm[];
  fuelTypes: VehicaTaxonomyTerm[];
  transmissions: VehicaTaxonomyTerm[];
  conditions: VehicaTaxonomyTerm[];
  colors: VehicaTaxonomyTerm[];
}

function FilterControls({
  makes,
  models,
  bodyTypes,
  fuelTypes,
  transmissions,
  conditions,
  colors,
}: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "all") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      // Clear model when make changes (models depend on make)
      if (key === "make") {
        params.delete("model");
      }
      router.push(`/vehicles?${params.toString()}`);
    },
    [router, searchParams]
  );

  const selectedMakeSlug = searchParams.get("make");

  const clearFilters = useCallback(() => {
    router.push("/vehicles");
  }, [router]);

  const hasFilters = searchParams.toString().length > 0;

  return (
    <div className="space-y-5">
      {/* Sort */}
      <div>
        <Label className="mb-1.5 text-sm font-medium">Sort By</Label>
        <Select
          value={searchParams.get("sort") || "newest"}
          onValueChange={(v) => updateFilter("sort", v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Newest First" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="price_low">Price: Low to High</SelectItem>
            <SelectItem value="price_high">Price: High to Low</SelectItem>
            <SelectItem value="mileage_low">Mileage: Low to High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Make */}
      <div>
        <Label className="mb-1.5 text-sm font-medium">Make</Label>
        <Select
          value={searchParams.get("make") || "all"}
          onValueChange={(v) => updateFilter("make", v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Makes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Makes</SelectItem>
            {makes.map((m) => (
              <SelectItem key={m.id} value={m.slug}>
                {m.name} ({m.count})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Model */}
      <div>
        <Label className="mb-1.5 text-sm font-medium">Model</Label>
        <Select
          value={searchParams.get("model") || "all"}
          onValueChange={(v) => updateFilter("model", v)}
          disabled={!selectedMakeSlug}
        >
          <SelectTrigger>
            <SelectValue
              placeholder={selectedMakeSlug ? "All Models" : "Select a make first"}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Models</SelectItem>
            {models.map((m) => (
              <SelectItem key={m.id} value={m.slug}>
                {m.name} ({m.count})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Body Type */}
      <div>
        <Label className="mb-1.5 text-sm font-medium">Body Type</Label>
        <Select
          value={searchParams.get("bodyType") || "all"}
          onValueChange={(v) => updateFilter("bodyType", v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Body Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Body Types</SelectItem>
            {bodyTypes.map((b) => (
              <SelectItem key={b.id} value={b.slug}>
                {b.name} ({b.count})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Fuel Type */}
      <div>
        <Label className="mb-1.5 text-sm font-medium">Fuel Type</Label>
        <Select
          value={searchParams.get("fuelType") || "all"}
          onValueChange={(v) => updateFilter("fuelType", v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Fuel Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Fuel Types</SelectItem>
            {fuelTypes.map((f) => (
              <SelectItem key={f.id} value={f.slug}>
                {f.name} ({f.count})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Transmission */}
      <div>
        <Label className="mb-1.5 text-sm font-medium">Transmission</Label>
        <Select
          value={searchParams.get("transmission") || "all"}
          onValueChange={(v) => updateFilter("transmission", v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Transmissions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Transmissions</SelectItem>
            {transmissions.map((t) => (
              <SelectItem key={t.id} value={t.slug}>
                {t.name} ({t.count})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Condition */}
      <div>
        <Label className="mb-1.5 text-sm font-medium">Condition</Label>
        <Select
          value={searchParams.get("condition") || "all"}
          onValueChange={(v) => updateFilter("condition", v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Conditions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Conditions</SelectItem>
            {conditions.map((c) => (
              <SelectItem key={c.id} value={c.slug}>
                {c.name} ({c.count})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Color */}
      <div>
        <Label className="mb-1.5 text-sm font-medium">Color</Label>
        <Select
          value={searchParams.get("color") || "all"}
          onValueChange={(v) => updateFilter("color", v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Colors" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Colors</SelectItem>
            {colors.map((c) => (
              <SelectItem key={c.id} value={c.slug}>
                {c.name} ({c.count})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div>
        <Label className="mb-1.5 text-sm font-medium">Price Range</Label>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Min"
            defaultValue={searchParams.get("priceFrom") || ""}
            onBlur={(e) => updateFilter("priceFrom", e.target.value)}
          />
          <Input
            type="number"
            placeholder="Max"
            defaultValue={searchParams.get("priceTo") || ""}
            onBlur={(e) => updateFilter("priceTo", e.target.value)}
          />
        </div>
      </div>

      {/* Year Range */}
      <div>
        <Label className="mb-1.5 text-sm font-medium">Year</Label>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="From"
            defaultValue={searchParams.get("yearFrom") || ""}
            onBlur={(e) => updateFilter("yearFrom", e.target.value)}
          />
          <Input
            type="number"
            placeholder="To"
            defaultValue={searchParams.get("yearTo") || ""}
            onBlur={(e) => updateFilter("yearTo", e.target.value)}
          />
        </div>
      </div>

      {/* Clear */}
      {hasFilters && (
        <Button variant="outline" className="w-full" onClick={clearFilters}>
          <X className="mr-2 h-4 w-4" />
          Clear All Filters
        </Button>
      )}
    </div>
  );
}

/** Desktop sidebar + Mobile drawer */
export function FilterSidebar(props: FilterSidebarProps) {
  return (
    <>
      {/* Mobile: Sheet drawer */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Filter Vehicles</SheetTitle>
            </SheetHeader>
            <div className="mt-4">
              <FilterControls {...props} />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop: Sidebar */}
      <aside className="hidden lg:block lg:w-64 lg:shrink-0">
        <div className="sticky top-24 space-y-1">
          <h2 className="mb-4 text-lg font-semibold">Filter Vehicles</h2>
          <FilterControls {...props} />
        </div>
      </aside>
    </>
  );
}
