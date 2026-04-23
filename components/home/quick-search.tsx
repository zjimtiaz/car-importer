"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { VehicaTaxonomyTerm } from "@/lib/vehica";

interface QuickSearchProps {
  makes: VehicaTaxonomyTerm[];
  bodyTypes: VehicaTaxonomyTerm[];
}

export function QuickSearch({ makes, bodyTypes }: QuickSearchProps) {
  const router = useRouter();
  const [make, setMake] = useState("");
  const [bodyType, setBodyType] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (make) params.set("make", make);
    if (bodyType) params.set("bodyType", bodyType);
    router.push(`/cars?${params.toString()}`);
  };

  return (
    <div className="mx-auto -mt-8 max-w-3xl px-6 relative z-10">
      <div className="flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-lg sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="mb-1 block text-xs font-medium text-muted-foreground">
            Make
          </label>
          <Select value={make} onValueChange={setMake}>
            <SelectTrigger>
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
          <label className="mb-1 block text-xs font-medium text-muted-foreground">
            Body Type
          </label>
          <Select value={bodyType} onValueChange={setBodyType}>
            <SelectTrigger>
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

        <Button onClick={handleSearch} className="sm:px-8">
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
      </div>
    </div>
  );
}
