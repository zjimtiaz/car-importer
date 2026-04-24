import Link from "next/link";
import Image from "next/image";
import { Fuel, Gauge, Settings2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ParsedCar } from "@/lib/vehica";

interface VehicleCardProps {
  car: ParsedCar;
}

export function VehicleCard({ car }: VehicleCardProps) {
  return (
    <Link
      href={`/vehicles/${car.slug}`}
      className="group block overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <Image
          src={car.mainImage}
          alt={car.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Top-left badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {car.featured && (
            <Badge className="bg-primary text-primary-foreground shadow-md text-[11px] px-2 py-0.5">
              Featured
            </Badge>
          )}
        </div>

        {/* Top-right: photo count + year */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          {car.gallery.length > 1 && (
            <span className="flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[11px] text-white backdrop-blur-sm">
              {car.gallery.length}
            </span>
          )}
          {car.year && (
            <span className="rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
              {car.year}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Body type label */}
        {car.bodyType && (
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            {car.bodyType}
          </span>
        )}

        {/* Title */}
        <h3 className="mt-1 line-clamp-2 text-sm font-bold leading-snug group-hover:text-primary transition-colors">
          {car.name}
        </h3>

        {/* Specs row */}
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          {car.mileage && car.mileage.trim() !== "" && (
            <span className="flex items-center gap-1">
              <Gauge className="h-3 w-3 shrink-0" />
              <span className="truncate">{car.mileage}</span>
            </span>
          )}
          {car.fuelType && (
            <span className="flex items-center gap-1">
              <Fuel className="h-3 w-3 shrink-0" />
              <span className="truncate">{car.fuelType}</span>
            </span>
          )}
          {car.transmission && (
            <span className="flex items-center gap-1">
              <Settings2 className="h-3 w-3 shrink-0" />
              <span className="truncate">
                {car.transmission === "Automatic" ? "Auto" : car.transmission}
              </span>
            </span>
          )}
        </div>

        {/* Divider */}
        <div className="my-3 border-t" />

        {/* Price + View */}
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-primary">
            {car.priceDisplay}
          </span>
          <span className="rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground group-hover:border-primary group-hover:text-primary transition-colors">
            View Car
          </span>
        </div>
      </div>
    </Link>
  );
}
