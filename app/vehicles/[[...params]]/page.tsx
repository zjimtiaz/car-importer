import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import {
  ChevronRight,
  Phone,
  MapPin,
  Share2,
  Heart,
  Shield,
  Truck,
  FileCheck,
} from "lucide-react";
import { Container, Section } from "@/components/craft";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  getVehicaCarBySlug,
  getRelatedCars,
  getVehicaCars,
  getAllFilterOptions,
  getMakes,
  getModels,
} from "@/lib/vehica";
import type { VehicaFilters, VehicaTaxonomyTerm } from "@/lib/vehica";
import { VehicleGallery } from "@/components/cars/vehicle-gallery";
import { VehicleSpecs } from "@/components/cars/vehicle-specs";
import { VehicleCard } from "@/components/cars/vehicle-card";
import { VehicleGrid } from "@/components/cars/vehicle-grid";
import { FilterSidebar } from "@/components/filters/filter-sidebar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { EnquiryForm } from "@/components/cars/enquiry-form";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ params?: string[] }>;
  searchParams: Promise<Record<string, string | undefined>>;
}

/** Check if a slug belongs to a make taxonomy (rather than a car detail slug) */
async function isMakeSlug(slug: string): Promise<boolean> {
  const makes = await getMakes();
  return makes.some((m) => m.slug === slug);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { params: segments } = await params;

  // No segments = listing page
  if (!segments || segments.length === 0) {
    return {
      title: "Our Vehicles | Car Importers",
      description:
        "Browse our selection of premium imported vehicles. Filter by make, model, price, and more.",
    };
  }

  const firstSegment = segments[0];

  // Check if it's a make filter
  if (await isMakeSlug(firstSegment)) {
    const makes = await getMakes();
    const make = makes.find((m) => m.slug === firstSegment);
    const makeName = make?.name || firstSegment;

    if (segments.length === 2) {
      const models = await getModels();
      const model = models.find((m) => m.slug === segments[1]);
      const modelName = model?.name || segments[1];
      return {
        title: `${makeName} ${modelName} Vehicles | Car Importers`,
        description: `Browse ${makeName} ${modelName} vehicles. Premium imported cars at competitive prices.`,
      };
    }

    return {
      title: `${makeName} Vehicles | Car Importers`,
      description: `Browse ${makeName} vehicles. Premium imported cars at competitive prices.`,
    };
  }

  // It's a car detail slug
  const car = await getVehicaCarBySlug(firstSegment);
  if (!car) {
    return { title: "Car Not Found | Car Importers" };
  }

  return {
    title: `${car.name} | Car Importers`,
    description: `${car.year} ${car.make} ${car.model} — ${car.fuelType}, ${car.transmission}, ${car.mileage}. ${car.priceDisplay}. View details and gallery.`,
    openGraph: {
      title: car.name,
      description: `${car.priceDisplay} — ${car.year} ${car.make} ${car.model}`,
      images: car.mainImage ? [{ url: car.mainImage }] : [],
    },
  };
}

/** Keep only taxonomy terms that exist in the filtered car results */
function filterAvailableTerms(
  allTerms: VehicaTaxonomyTerm[],
  availableSlugs: Set<string>
): VehicaTaxonomyTerm[] {
  if (availableSlugs.size === 0) return allTerms;
  return allTerms.filter((t) => availableSlugs.has(t.slug));
}

// ─── Listing Page ────────────────────────────────────────
async function VehiclesListing({
  makeSlug,
  modelSlug,
  searchParams,
}: {
  makeSlug?: string;
  modelSlug?: string;
  searchParams: Record<string, string | undefined>;
}) {
  const filters: VehicaFilters = {
    make: makeSlug || searchParams.make,
    model: modelSlug || searchParams.model,
    bodyType: searchParams.bodyType,
    fuelType: searchParams.fuelType,
    transmission: searchParams.transmission,
    condition: searchParams.condition,
    color: searchParams.color,
    driveType: searchParams.driveType,
    yearFrom: searchParams.yearFrom,
    yearTo: searchParams.yearTo,
    priceFrom: searchParams.priceFrom,
    priceTo: searchParams.priceTo,
    sort: (searchParams.sort as VehicaFilters["sort"]) || "newest",
  };

  const hasFilters = Object.entries(filters).some(
    ([k, v]) => v && k !== "sort"
  );

  const [cars, allFilterOptions] = await Promise.all([
    getVehicaCars(filters),
    getAllFilterOptions(),
  ]);

  let availableModels = allFilterOptions.models;
  let availableBodyTypes = allFilterOptions.bodyTypes;
  let availableFuelTypes = allFilterOptions.fuelTypes;
  let availableTransmissions = allFilterOptions.transmissions;
  let availableConditions = allFilterOptions.conditions;
  let availableColors = allFilterOptions.colors;

  if (hasFilters) {
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

    if (!searchParams.model && !modelSlug) availableModels = filterAvailableTerms(allFilterOptions.models, modelSlugs);
    if (!searchParams.bodyType) availableBodyTypes = filterAvailableTerms(allFilterOptions.bodyTypes, bodyTypeSlugs);
    if (!searchParams.fuelType) availableFuelTypes = filterAvailableTerms(allFilterOptions.fuelTypes, fuelSlugs);
    if (!searchParams.transmission) availableTransmissions = filterAvailableTerms(allFilterOptions.transmissions, transSlugs);
    if (!searchParams.condition) availableConditions = filterAvailableTerms(allFilterOptions.conditions, condSlugs);
    if (!searchParams.color) availableColors = filterAvailableTerms(allFilterOptions.colors, colorSlugs);
  }

  if (makeSlug || searchParams.make) {
    const activeMake = makeSlug || searchParams.make!;
    const carsForMake = hasFilters
      ? cars
      : await getVehicaCars({ make: activeMake });
    const modelSlugsSet = new Set(
      carsForMake.map((c) => c.modelSlug).filter(Boolean)
    );
    availableModels = allFilterOptions.models.filter((m) =>
      modelSlugsSet.has(m.slug)
    );
  }

  // Build page title
  let pageTitle = "Our Vehicles";
  if (makeSlug) {
    const make = allFilterOptions.makes.find((m) => m.slug === makeSlug);
    pageTitle = make ? `${make.name} Vehicles` : "Our Vehicles";
    if (modelSlug) {
      const model = allFilterOptions.models.find((m) => m.slug === modelSlug);
      pageTitle = model ? `${make?.name || ""} ${model.name}` : pageTitle;
    }
  }

  return (
    <Section>
      <Container className="max-w-7xl">
        <div className="mb-8">
          {/* Breadcrumb */}
          <nav className="mb-4 flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <ChevronRight className="h-3 w-3" />
            {makeSlug ? (
              <>
                <Link href="/vehicles" className="hover:text-foreground">Vehicles</Link>
                <ChevronRight className="h-3 w-3" />
                {modelSlug ? (
                  <>
                    <Link href={`/vehicles/${makeSlug}`} className="hover:text-foreground">
                      {allFilterOptions.makes.find((m) => m.slug === makeSlug)?.name || makeSlug}
                    </Link>
                    <ChevronRight className="h-3 w-3" />
                    <span className="text-foreground">
                      {allFilterOptions.models.find((m) => m.slug === modelSlug)?.name || modelSlug}
                    </span>
                  </>
                ) : (
                  <span className="text-foreground">
                    {allFilterOptions.makes.find((m) => m.slug === makeSlug)?.name || makeSlug}
                  </span>
                )}
              </>
            ) : (
              <span className="text-foreground">Vehicles</span>
            )}
          </nav>

          <h1 className="text-3xl font-bold">{pageTitle}</h1>
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
              currentMake={makeSlug}
              currentModel={modelSlug}
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

// ─── Car Detail Page ─────────────────────────────────────
async function CarDetail({ slug }: { slug: string }) {
  const car = await getVehicaCarBySlug(slug);
  if (!car) notFound();

  const relatedCars = await getRelatedCars(car, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Vehicle",
    name: car.name,
    brand: { "@type": "Brand", name: car.make },
    model: car.model,
    modelDate: car.year,
    fuelType: car.fuelType,
    vehicleTransmission: car.transmission,
    color: car.color,
    numberOfDoors: car.doors || undefined,
    driveWheelConfiguration: car.driveType || undefined,
    vehicleEngine: car.engineSize
      ? { "@type": "EngineSpecification", name: car.engineSize }
      : undefined,
    offers: {
      "@type": "Offer",
      price: car.price || undefined,
      priceCurrency: "GBP",
      availability: "https://schema.org/InStock",
    },
    image: car.gallery.map((img) => img.url),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-7xl px-6 pb-8 sm:px-8">
        <div>
          {/* Breadcrumb */}
          <nav className="py-2 flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/vehicles" className="hover:text-foreground">Vehicles</Link>
            {car.make && (
              <>
                <ChevronRight className="h-3 w-3" />
                <Link href={`/vehicles/${car.makeSlug}`} className="hover:text-foreground">
                  {car.make}
                </Link>
              </>
            )}
            {car.model && (
              <>
                <ChevronRight className="h-3 w-3" />
                <Link href={`/vehicles/${car.makeSlug}/${car.modelSlug}`} className="hover:text-foreground">
                  {car.model}
                </Link>
              </>
            )}
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">{car.name}</span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:items-start overflow-hidden">
            {/* Left: Gallery + Tabbed Content */}
            <div className="space-y-8 overflow-hidden">
              <VehicleGallery images={car.gallery} alt={car.name} />

              {/* Tabbed sections */}
              <Tabs defaultValue="overview">
                <TabsList className="w-full justify-start gap-0 overflow-x-auto no-scrollbar">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  {car.description && (
                    <TabsTrigger value="description">Description</TabsTrigger>
                  )}
                  <TabsTrigger value="specs">Specifications</TabsTrigger>
                  {car.location && (
                    <TabsTrigger value="location">Location</TabsTrigger>
                  )}
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {car.year && (
                      <div className="rounded-lg border bg-card p-4 text-center">
                        <p className="text-xs text-muted-foreground">Year</p>
                        <p className="mt-1 text-lg font-semibold">{car.year}</p>
                      </div>
                    )}
                    {car.mileage && (
                      <div className="rounded-lg border bg-card p-4 text-center">
                        <p className="text-xs text-muted-foreground">Mileage</p>
                        <p className="mt-1 text-lg font-semibold">{car.mileage}</p>
                      </div>
                    )}
                    {car.fuelType && (
                      <div className="rounded-lg border bg-card p-4 text-center">
                        <p className="text-xs text-muted-foreground">Fuel</p>
                        <p className="mt-1 text-lg font-semibold">{car.fuelType}</p>
                      </div>
                    )}
                    {car.transmission && (
                      <div className="rounded-lg border bg-card p-4 text-center">
                        <p className="text-xs text-muted-foreground">Transmission</p>
                        <p className="mt-1 text-lg font-semibold">{car.transmission}</p>
                      </div>
                    )}
                  </div>

                  <div className="rounded-lg border bg-card p-6">
                    <h3 className="mb-4 font-semibold">Vehicle Details</h3>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {car.make && (
                        <div className="flex justify-between border-b pb-2 text-sm">
                          <span className="text-muted-foreground">Make</span>
                          <span className="font-medium">{car.make}</span>
                        </div>
                      )}
                      {car.model && (
                        <div className="flex justify-between border-b pb-2 text-sm">
                          <span className="text-muted-foreground">Model</span>
                          <span className="font-medium">{car.model}</span>
                        </div>
                      )}
                      {car.bodyType && (
                        <div className="flex justify-between border-b pb-2 text-sm">
                          <span className="text-muted-foreground">Body Type</span>
                          <span className="font-medium">{car.bodyType}</span>
                        </div>
                      )}
                      {car.engineSize && (
                        <div className="flex justify-between border-b pb-2 text-sm">
                          <span className="text-muted-foreground">Engine</span>
                          <span className="font-medium">{car.engineSize}</span>
                        </div>
                      )}
                      {car.driveType && (
                        <div className="flex justify-between border-b pb-2 text-sm">
                          <span className="text-muted-foreground">Drive</span>
                          <span className="font-medium">{car.driveType}</span>
                        </div>
                      )}
                      {car.color && (
                        <div className="flex justify-between border-b pb-2 text-sm">
                          <span className="text-muted-foreground">Colour</span>
                          <span className="font-medium">{car.color}</span>
                        </div>
                      )}
                      {car.doors && (
                        <div className="flex justify-between border-b pb-2 text-sm">
                          <span className="text-muted-foreground">Doors</span>
                          <span className="font-medium">{car.doors}</span>
                        </div>
                      )}
                      {car.condition && (
                        <div className="flex justify-between border-b pb-2 text-sm">
                          <span className="text-muted-foreground">Condition</span>
                          <span className="font-medium">{car.condition}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="flex items-start gap-3 rounded-lg border p-4">
                      <Shield className="mt-0.5 h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium">Quality Assured</p>
                        <p className="text-xs text-muted-foreground">Full inspection before delivery</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 rounded-lg border p-4">
                      <Truck className="mt-0.5 h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium">UK-Wide Delivery</p>
                        <p className="text-xs text-muted-foreground">Delivered to your door</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 rounded-lg border p-4">
                      <FileCheck className="mt-0.5 h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium">Full History</p>
                        <p className="text-xs text-muted-foreground">HPI checked & documented</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Description Tab */}
                {car.description && (
                  <TabsContent value="description">
                    <div className="rounded-lg border bg-card p-6">
                      <div
                        className="prose prose-sm max-w-none text-muted-foreground"
                        dangerouslySetInnerHTML={{ __html: car.description }}
                      />
                    </div>
                  </TabsContent>
                )}

                {/* Specifications Tab */}
                <TabsContent value="specs">
                  <VehicleSpecs car={car} />
                </TabsContent>

                {/* Location Tab */}
                {car.location && (
                  <TabsContent value="location">
                    <div className="rounded-lg border bg-card p-6">
                      <div className="flex items-start gap-3">
                        <MapPin className="mt-0.5 h-5 w-5 text-primary" />
                        <div>
                          <h3 className="font-semibold">Vehicle Location</h3>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {car.location.address}
                          </p>
                          {car.location.lat && car.location.lng && (
                            <a
                              href={`https://www.google.com/maps?q=${car.location.lat},${car.location.lng}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-3 inline-flex items-center gap-1 text-sm text-primary hover:underline"
                            >
                              Open in Google Maps
                              <ChevronRight className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                )}
              </Tabs>

              {/* Video — inside the listing, left column */}
              {car.videoEmbed && (
                <div className="overflow-hidden rounded-lg">
                  <h2 className="mb-4 text-2xl font-bold">Video</h2>
                  <div
                    className="aspect-video [&>iframe]:h-full [&>iframe]:w-full [&>iframe]:rounded-lg"
                    dangerouslySetInnerHTML={{ __html: car.videoEmbed }}
                  />
                </div>
              )}
            </div>

            {/* Right: Price + Enquiry sidebar */}
            <div>
              <div className="sticky top-24 space-y-6">
                <div className="rounded-lg border bg-card p-6">
                  <div className="mb-1 flex items-center gap-2">
                    {car.featured && (
                      <Badge className="bg-primary text-primary-foreground">Featured</Badge>
                    )}
                    {car.condition && (
                      <Badge variant="outline">{car.condition}</Badge>
                    )}
                  </div>

                  <h1 className="mt-2 text-2xl font-bold">{car.name}</h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {[car.year, car.make, car.model].filter(Boolean).join(" ")}
                  </p>

                  <Separator className="my-4" />
                  <p className="text-3xl font-bold text-primary">{car.priceDisplay}</p>
                  <Separator className="my-4" />

                  <div className="space-y-2 text-sm">
                    {car.mileage && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Mileage</span>
                        <span className="font-medium">{car.mileage}</span>
                      </div>
                    )}
                    {car.fuelType && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Fuel</span>
                        <span className="font-medium">{car.fuelType}</span>
                      </div>
                    )}
                    {car.transmission && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Transmission</span>
                        <span className="font-medium">{car.transmission}</span>
                      </div>
                    )}
                    {car.engineSize && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Engine</span>
                        <span className="font-medium">{car.engineSize}</span>
                      </div>
                    )}
                  </div>

                  <Separator className="my-4" />

                  <div className="flex gap-2">
                    <Button className="flex-1" size="lg">
                      <Phone className="mr-2 h-4 w-4" />
                      Call Us
                    </Button>
                    <Button variant="outline" size="icon" className="h-11 w-11">
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-11 w-11">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="rounded-lg border bg-card p-6">
                  <h3 className="mb-4 text-lg font-semibold">Enquire About This Vehicle</h3>
                  <EnquiryForm carName={car.name} />
                </div>

                {car.location && (
                  <div className="rounded-lg border bg-card p-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <div>
                        <h3 className="text-sm font-semibold">Location</h3>
                        <p className="text-xs text-muted-foreground">{car.location.address}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Related vehicles */}
          {relatedCars.length > 0 && (
            <div className="mt-16">
              <h2 className="mb-6 text-2xl font-bold">Similar Vehicles</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {relatedCars.map((c) => (
                  <VehicleCard key={c.id} car={c} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ─── Main Page Component ─────────────────────────────────
export default async function VehiclesPage({ params, searchParams }: PageProps) {
  const { params: segments } = await params;
  const sp = await searchParams;

  // No segments → listing page
  if (!segments || segments.length === 0) {
    return <VehiclesListing searchParams={sp} />;
  }

  const firstSegment = segments[0];

  // Check if the first segment is a make
  const isaMake = await isMakeSlug(firstSegment);

  if (isaMake) {
    // /vehicles/bmw or /vehicles/bmw/3-series
    const modelSlug = segments.length >= 2 ? segments[1] : undefined;
    return (
      <VehiclesListing
        makeSlug={firstSegment}
        modelSlug={modelSlug}
        searchParams={sp}
      />
    );
  }

  // Otherwise, it's a car detail page: /vehicles/2017-aston-martin-db11
  return <CarDetail slug={firstSegment} />;
}
