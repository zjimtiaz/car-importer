import type { Metadata } from "next";
import { Suspense } from "react";
import { Container, Section } from "@/components/craft";
import { getVehicaCars, getAllFilterOptions } from "@/lib/vehica";
import type { VehicaFilters } from "@/lib/vehica";
import { VehicleGrid } from "@/components/cars/vehicle-grid";
import { FilterSidebar } from "@/components/filters/filter-sidebar";

export const metadata: Metadata = {
  title: "Our Cars | Car Importers",
  description:
    "Browse our selection of premium imported vehicles. Filter by make, model, price, and more.",
};

// Force dynamic rendering so filters work with searchParams
export const dynamic = "force-dynamic";

interface CarsPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function CarsPage({ searchParams }: CarsPageProps) {
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

  const [cars, filterOptions] = await Promise.all([
    getVehicaCars(filters),
    getAllFilterOptions(),
  ]);

  // Filter models to only those available for the selected make
  // (Makes and models are separate taxonomies, so we derive from car data)
  let availableModels = filterOptions.models;
  if (params.make) {
    const carsForMake = await getVehicaCars({ make: params.make });
    const modelSlugs = new Set(
      carsForMake.map((c) => c.modelSlug).filter(Boolean)
    );
    availableModels = filterOptions.models.filter((m) =>
      modelSlugs.has(m.slug)
    );
  }

  return (
    <Section>
      <Container>
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Our Cars</h1>
          <p className="mt-2 text-muted-foreground">
            Explore our curated selection of premium imported vehicles
          </p>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          <Suspense fallback={null}>
            <FilterSidebar
              makes={filterOptions.makes}
              models={availableModels}
              bodyTypes={filterOptions.bodyTypes}
              fuelTypes={filterOptions.fuelTypes}
              transmissions={filterOptions.transmissions}
              conditions={filterOptions.conditions}
              colors={filterOptions.colors}
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
