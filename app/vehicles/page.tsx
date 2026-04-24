import type { Metadata } from "next";
import { Suspense } from "react";
import { Container, Section } from "@/components/craft";
import { getVehicaCars, getAllFilterOptions } from "@/lib/vehica";
import type { VehicaFilters, VehicaTaxonomyTerm } from "@/lib/vehica";
import { VehicleGrid } from "@/components/cars/vehicle-grid";
import { FilterSidebar } from "@/components/filters/filter-sidebar";

export const metadata: Metadata = {
  title: "Our Vehicles | Car Importers",
  description:
    "Browse our selection of premium imported vehicles. Filter by make, model, price, and more.",
};

export const dynamic = "force-dynamic";

interface VehiclesPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

/** Keep only taxonomy terms that exist in the filtered car results */
function filterAvailableTerms(
  allTerms: VehicaTaxonomyTerm[],
  availableSlugs: Set<string>
): VehicaTaxonomyTerm[] {
  if (availableSlugs.size === 0) return allTerms;
  return allTerms.filter((t) => availableSlugs.has(t.slug));
}

export default async function VehiclesPage({ searchParams }: VehiclesPageProps) {
  const params = await searchParams;

  const filters: VehicaFilters = {
    make: params.make,
    model: params.model,
    bodyType: params.bodyType,
    fuelType: params.fuelType,
    transmission: params.transmission,
    condition: params.condition,
    color: params.color,
    driveType: params.driveType,
    yearFrom: params.yearFrom,
    yearTo: params.yearTo,
    priceFrom: params.priceFrom,
    priceTo: params.priceTo,
    sort: (params.sort as VehicaFilters["sort"]) || "newest",
  };

  const hasFilters = Object.entries(filters).some(
    ([k, v]) => v && k !== "sort"
  );

  const [cars, allFilterOptions] = await Promise.all([
    getVehicaCars(filters),
    getAllFilterOptions(),
  ]);

  // Derive available filter options from the current result set
  // so dropdowns only show values that exist in the filtered cars
  let availableModels = allFilterOptions.models;
  let availableBodyTypes = allFilterOptions.bodyTypes;
  let availableFuelTypes = allFilterOptions.fuelTypes;
  let availableTransmissions = allFilterOptions.transmissions;
  let availableConditions = allFilterOptions.conditions;
  let availableColors = allFilterOptions.colors;

  if (hasFilters) {
    // Get all cars matching current filters (to derive what's available)
    const modelSlugs = new Set(cars.map((c) => c.modelSlug).filter(Boolean));
    const bodyTypeSlugs = new Set(cars.map((c) => c.bodyTypeSlug).filter(Boolean));
    const fuelSlugs = new Set(
      cars.map((c) => c.fuelType?.toLowerCase().replace(/\s+/g, "-")).filter(Boolean)
    );
    const transSlugs = new Set(
      cars.map((c) => c.transmission?.toLowerCase().replace(/\s+/g, "-")).filter(Boolean)
    );
    const condSlugs = new Set(
      cars.map((c) => c.condition?.toLowerCase().replace(/\s+/g, "-")).filter(Boolean)
    );
    const colorSlugs = new Set(
      cars.map((c) => c.color?.toLowerCase().replace(/\s+/g, "-")).filter(Boolean)
    );

    // Only narrow down options for filters that are NOT currently selected
    // (so the selected filter still shows all its own options)
    if (!params.model) availableModels = filterAvailableTerms(allFilterOptions.models, modelSlugs);
    if (!params.bodyType) availableBodyTypes = filterAvailableTerms(allFilterOptions.bodyTypes, bodyTypeSlugs);
    if (!params.fuelType) availableFuelTypes = filterAvailableTerms(allFilterOptions.fuelTypes, fuelSlugs);
    if (!params.transmission) availableTransmissions = filterAvailableTerms(allFilterOptions.transmissions, transSlugs);
    if (!params.condition) availableConditions = filterAvailableTerms(allFilterOptions.conditions, condSlugs);
    if (!params.color) availableColors = filterAvailableTerms(allFilterOptions.colors, colorSlugs);
  }

  // Further filter models by selected make
  if (params.make) {
    const carsForMake = hasFilters
      ? cars
      : await getVehicaCars({ make: params.make });
    const modelSlugs = new Set(
      carsForMake.map((c) => c.modelSlug).filter(Boolean)
    );
    availableModels = allFilterOptions.models.filter((m) =>
      modelSlugs.has(m.slug)
    );
  }

  return (
    <Section>
      <Container>
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Our Vehicles</h1>
          <p className="mt-2 text-muted-foreground">
            Explore our curated selection of premium imported vehicles
          </p>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          <Suspense fallback={null}>
            <FilterSidebar
              makes={allFilterOptions.makes}
              models={availableModels}
              bodyTypes={availableBodyTypes}
              fuelTypes={availableFuelTypes}
              transmissions={availableTransmissions}
              conditions={availableConditions}
              colors={availableColors}
            />
          </Suspense>

          <div className="flex-1">
            <VehicleGrid cars={cars} totalCount={cars.length} />
          </div>
        </div>
      </Container>
    </Section>
  );
}
