import Link from "next/link";
import { Car, Truck, Bike, Bus } from "lucide-react";
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
  if (bodyTypes.length === 0) return null;

  return (
    <section className="bg-muted/50 py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold md:text-3xl">Browse by Body Type</h2>
          <p className="mt-1 text-muted-foreground">
            Find the perfect style for your needs
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {bodyTypes.map((bt) => {
            const Icon = iconMap[bt.slug] || Car;
            return (
              <Link
                key={bt.id}
                href={`/vehicles?bodyType=${bt.slug}`}
                className="flex flex-col items-center gap-3 rounded-lg border bg-card p-6 text-center transition-colors hover:border-primary hover:bg-primary/5"
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
    </section>
  );
}
