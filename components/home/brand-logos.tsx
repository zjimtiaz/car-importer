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
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide md:flex-wrap md:items-center md:justify-center md:gap-6 md:overflow-visible md:pb-0 lg:gap-10">
          {makes.map((make) => (
            <Link
              key={make.id}
              href={`/vehicles?make=${make.slug}`}
              className="flex min-w-[100px] shrink-0 snap-start flex-col items-center gap-1 rounded-lg px-4 py-3 transition-colors hover:bg-muted md:min-w-0"
            >
              <span className="text-xl font-bold text-foreground/80 md:text-2xl whitespace-nowrap">
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
