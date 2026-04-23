import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
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
  getAllCarSlugs,
} from "@/lib/vehica";
import { VehicleGallery } from "@/components/cars/vehicle-gallery";
import { VehicleSpecs } from "@/components/cars/vehicle-specs";
import { VehicleCard } from "@/components/cars/vehicle-card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { EnquiryForm } from "@/components/cars/enquiry-form";

interface CarDetailProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllCarSlugs();
}

export async function generateMetadata({
  params,
}: CarDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const car = await getVehicaCarBySlug(slug);

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

export default async function CarDetailPage({ params }: CarDetailProps) {
  const { slug } = await params;
  const car = await getVehicaCarBySlug(slug);

  if (!car) notFound();

  const relatedCars = await getRelatedCars(car, 4);

  // JSON-LD Vehicle Schema
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

      <Section>
        <Container>
          {/* Breadcrumb */}
          <nav className="mb-6 flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/cars" className="hover:text-foreground">
              Cars
            </Link>
            {car.make && (
              <>
                <ChevronRight className="h-3 w-3" />
                <Link
                  href={`/cars?make=${car.makeSlug}`}
                  className="hover:text-foreground"
                >
                  {car.make}
                </Link>
              </>
            )}
            {car.model && (
              <>
                <ChevronRight className="h-3 w-3" />
                <Link
                  href={`/cars?make=${car.makeSlug}&model=${car.modelSlug}`}
                  className="hover:text-foreground"
                >
                  {car.model}
                </Link>
              </>
            )}
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">{car.name}</span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            {/* Left: Gallery + Tabbed Content */}
            <div className="space-y-8">
              <VehicleGallery images={car.gallery} alt={car.name} />

              {/* Tabbed sections */}
              <Tabs defaultValue="overview">
                <TabsList className="w-full justify-start gap-0 overflow-x-auto">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="specs">Specifications</TabsTrigger>
                  {car.description && (
                    <TabsTrigger value="description">Description</TabsTrigger>
                  )}
                  {car.location && (
                    <TabsTrigger value="location">Location</TabsTrigger>
                  )}
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                  {/* Key highlights */}
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
                        <p className="mt-1 text-lg font-semibold">
                          {car.mileage}
                        </p>
                      </div>
                    )}
                    {car.fuelType && (
                      <div className="rounded-lg border bg-card p-4 text-center">
                        <p className="text-xs text-muted-foreground">Fuel</p>
                        <p className="mt-1 text-lg font-semibold">
                          {car.fuelType}
                        </p>
                      </div>
                    )}
                    {car.transmission && (
                      <div className="rounded-lg border bg-card p-4 text-center">
                        <p className="text-xs text-muted-foreground">
                          Transmission
                        </p>
                        <p className="mt-1 text-lg font-semibold">
                          {car.transmission}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Quick specs summary */}
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
                          <span className="text-muted-foreground">
                            Body Type
                          </span>
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
                          <span className="text-muted-foreground">
                            Condition
                          </span>
                          <span className="font-medium">{car.condition}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Trust signals */}
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="flex items-start gap-3 rounded-lg border p-4">
                      <Shield className="mt-0.5 h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium">Quality Assured</p>
                        <p className="text-xs text-muted-foreground">
                          Full inspection before delivery
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 rounded-lg border p-4">
                      <Truck className="mt-0.5 h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium">UK-Wide Delivery</p>
                        <p className="text-xs text-muted-foreground">
                          Delivered to your door
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 rounded-lg border p-4">
                      <FileCheck className="mt-0.5 h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium">Full History</p>
                        <p className="text-xs text-muted-foreground">
                          HPI checked & documented
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Specifications Tab */}
                <TabsContent value="specs">
                  <VehicleSpecs car={car} />
                </TabsContent>

                {/* Description Tab */}
                {car.description && (
                  <TabsContent value="description">
                    <div
                      className="prose prose-sm max-w-none text-muted-foreground"
                      dangerouslySetInnerHTML={{ __html: car.description }}
                    />
                  </TabsContent>
                )}

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
            </div>

            {/* Right: Price + Enquiry sidebar */}
            <div>
              <div className="sticky top-24 space-y-6">
                {/* Price card */}
                <div className="rounded-lg border bg-card p-6">
                  <div className="mb-1 flex items-center gap-2">
                    {car.featured && (
                      <Badge className="bg-primary text-primary-foreground">
                        Featured
                      </Badge>
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

                  <p className="text-3xl font-bold text-primary">
                    {car.priceDisplay}
                  </p>

                  <Separator className="my-4" />

                  {/* Quick specs in sidebar */}
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
                        <span className="text-muted-foreground">
                          Transmission
                        </span>
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

                  {/* Action buttons */}
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

                {/* Enquiry form */}
                <div className="rounded-lg border bg-card p-6">
                  <h3 className="mb-4 text-lg font-semibold">
                    Enquire About This Vehicle
                  </h3>
                  <EnquiryForm carName={car.name} />
                </div>

                {/* Location mini */}
                {car.location && (
                  <div className="rounded-lg border bg-card p-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <div>
                        <h3 className="text-sm font-semibold">Location</h3>
                        <p className="text-xs text-muted-foreground">
                          {car.location.address}
                        </p>
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
        </Container>
      </Section>
    </>
  );
}
