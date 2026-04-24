"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ParsedCar, VehicaTaxonomyTerm } from "@/lib/vehica";

interface HeroSectionProps {
  cars: ParsedCar[];
  makes: VehicaTaxonomyTerm[];
  bodyTypes: VehicaTaxonomyTerm[];
}

export function HeroSection({ cars, makes, bodyTypes }: HeroSectionProps) {
  const router = useRouter();
  const [make, setMake] = useState("");
  const [bodyType, setBodyType] = useState("");

  const heroImage = cars[0]?.mainImage || "/hero-placeholder.jpg";

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (make) params.set("make", make);
    if (bodyType) params.set("bodyType", bodyType);
    router.push(`/vehicles?${params.toString()}`);
  };

  return (
    <section className="relative h-[520px] overflow-hidden bg-[hsl(222,47%,11%)] text-white md:h-[600px]">
      {/* Static background image */}
      <Image
        src={heroImage}
        alt="Premium Imported Vehicles"
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col items-start justify-center px-6">
        <div className="max-w-xl">
          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            Premium Imported Vehicles
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            Find Your Perfect{" "}
            <span className="text-primary">Imported Car</span>
          </h1>
          <p className="mt-4 text-base text-gray-300 md:text-lg">
            Browse our curated selection and drive home your dream car today.
            Quality assured with UK-wide delivery.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Button size="lg" asChild>
              <Link href="/vehicles">
                Browse All Cars
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 bg-white/10 text-white hover:bg-white/20"
              asChild
            >
              <Link href="/contact">Get In Touch</Link>
            </Button>
          </div>
        </div>

        {/* Search bar integrated into hero */}
        <div className="mt-8 w-full max-w-3xl">
          <div className="flex flex-col gap-3 rounded-xl bg-black/40 p-4 backdrop-blur-md sm:flex-row sm:items-end">
            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium text-gray-300">
                Make
              </label>
              <Select value={make} onValueChange={setMake}>
                <SelectTrigger className="border-white/20 bg-white/10 text-white [&>span]:text-white">
                  <SelectValue placeholder="Any Make" />
                </SelectTrigger>
                <SelectContent>
                  {makes.map((m) => (
                    <SelectItem key={m.id} value={m.slug}>
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium text-gray-300">
                Body Type
              </label>
              <Select value={bodyType} onValueChange={setBodyType}>
                <SelectTrigger className="border-white/20 bg-white/10 text-white [&>span]:text-white">
                  <SelectValue placeholder="Any Type" />
                </SelectTrigger>
                <SelectContent>
                  {bodyTypes.map((b) => (
                    <SelectItem key={b.id} value={b.slug}>
                      {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleSearch} size="lg" className="sm:px-8">
              <Search className="mr-2 h-4 w-4" />
              Find Cars
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
