import Link from "next/link";
import type { VehicaTaxonomyTerm } from "@/lib/vehica";

interface BrandLogosProps {
  makes: VehicaTaxonomyTerm[];
}

export function BrandLogos({ makes }: BrandLogosProps) {
  if (makes.length === 0) return null;

  return (
    <section className="border-y bg-card py-10">
      <div className="mx-auto max-w-7xl px-6">
        <p className="mb-6 text-center text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Browse by Brand
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
          {makes.map((make) => (
            <Link
              key={make.id}
              href={`/cars?make=${make.slug}`}
              className="flex flex-col items-center gap-1 rounded-lg px-4 py-3 transition-colors hover:bg-muted"
            >
              <span className="text-2xl font-bold text-foreground/80">
                {make.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {make.count} {make.count === 1 ? "car" : "cars"}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
