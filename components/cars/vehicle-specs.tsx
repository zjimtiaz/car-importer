import {
  Car,
  Calendar,
  Fuel,
  Gauge,
  Settings2,
  Palette,
  DoorOpen,
  Cog,
  Tag,
  MapPin,
} from "lucide-react";
import type { ParsedCar } from "@/lib/vehica";

interface VehicleSpecsProps {
  car: ParsedCar;
}

const specItems = [
  { key: "make" as const, label: "Make", icon: Car },
  { key: "model" as const, label: "Model", icon: Tag },
  { key: "year" as const, label: "Year", icon: Calendar },
  { key: "bodyType" as const, label: "Body Type", icon: Car },
  { key: "mileage" as const, label: "Mileage", icon: Gauge },
  { key: "fuelType" as const, label: "Fuel Type", icon: Fuel },
  { key: "transmission" as const, label: "Transmission", icon: Settings2 },
  { key: "driveType" as const, label: "Drive Type", icon: Cog },
  { key: "engineSize" as const, label: "Engine Size", icon: Settings2 },
  { key: "color" as const, label: "Colour", icon: Palette },
  { key: "doors" as const, label: "Doors", icon: DoorOpen },
  { key: "condition" as const, label: "Condition", icon: Tag },
];

export function VehicleSpecs({ car }: VehicleSpecsProps) {
  const visibleSpecs = specItems.filter((s) => car[s.key]);

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
      {visibleSpecs.map(({ key, label, icon: Icon }) => (
        <div
          key={key}
          className="flex items-center gap-3 rounded-lg border bg-card p-3"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Icon className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="truncate text-sm font-medium">{car[key]}</p>
          </div>
        </div>
      ))}
      {car.location && (
        <div className="flex items-center gap-3 rounded-lg border bg-card p-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
            <MapPin className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Location</p>
            <p className="truncate text-sm font-medium">
              {car.location.address}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
