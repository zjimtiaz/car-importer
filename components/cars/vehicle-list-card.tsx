import Link from "next/link";
import Image from "next/image";
import { Fuel, Gauge, Settings2, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ParsedCar } from "@/lib/vehica";

interface VehicleListCardProps {
  car: ParsedCar;
}

export function VehicleListCard({ car }: VehicleListCardProps) {
  return (
    <Link
      href={`/cars/${car.slug}`}
      className="group flex flex-col sm:flex-row overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-300 hover:shadow-lg hover:border-primary/30"
    >
      {/* Image */}
      <div className="relative w-full sm:w-56 md:w-64 shrink-0 aspect-[16/10] sm:aspect-auto sm:h-44 overflow-hidden bg-muted">
        <Image
          src={car.mainImage}
          alt={car.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, 256px"
        />
        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1.5">
          {car.featured && (
            <Badge className="bg-primary text-primary-foreground shadow-md text-[11px] px-2 py-0.5">
              Featured
            </Badge>
          )}
          {car.condition && (
            <Badge className="bg-white/90 text-foreground shadow-md hover:bg-white/90 text-[11px] px-2 py-0.5">
              {car.condition}
            </Badge>
          )}
        </div>
        {car.gallery.length > 1 && (
          <span className="absolute bottom-2 right-2 rounded-full bg-black/60 px-2 py-0.5 text-[11px] text-white backdrop-blur-sm">
            {car.gallery.length} photos
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between p-4 sm:py-3 sm:px-5">
        <div>
          <h3 className="text-base font-bold group-hover:text-primary transition-colors">
            {car.name}
          </h3>

          {/* Specs row */}
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            {car.mileage && car.mileage.trim() !== "" && (
              <span className="flex items-center gap-1">
                <Gauge className="h-3 w-3 shrink-0" />
                {car.mileage}
              </span>
            )}
            {car.fuelType && (
              <span className="flex items-center gap-1">
                <Fuel className="h-3 w-3 shrink-0" />
                {car.fuelType}
              </span>
            )}
            {car.transmission && (
              <span className="flex items-center gap-1">
                <Settings2 className="h-3 w-3 shrink-0" />
                {car.transmission === "Automatic" ? "Auto" : car.transmission}
              </span>
            )}
            {car.bodyType && (
              <span className="rounded bg-muted px-1.5 py-0.5 text-[11px]">
                {car.bodyType}
              </span>
            )}
            {car.year && (
              <span className="rounded bg-muted px-1.5 py-0.5 text-[11px]">
                {car.year}
              </span>
            )}
          </div>

          {/* Location */}
          {car.location && (
            <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 shrink-0 text-primary" />
              {car.location.address}
            </div>
          )}
        </div>

        {/* Price row */}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-primary">
            {car.priceDisplay}
          </span>
          <span className="text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors">
            View details →
          </span>
        </div>
      </div>
    </Link>
  );
}
