import type { Metadata } from "next";
import { getFeaturedCars, getMakes, getBodyTypes } from "@/lib/vehica";
import { getRecentPosts } from "@/lib/wordpress";
import { HeroSection } from "@/components/home/hero-section";
import { QuickSearch } from "@/components/home/quick-search";
import { FeaturedVehicles } from "@/components/home/featured-vehicles";
import { BodyTypeBrowse } from "@/components/home/body-type-browse";
import { BrandLogos } from "@/components/home/brand-logos";
import { ServicesSection } from "@/components/home/services-section";
import { LoanCalculator } from "@/components/home/loan-calculator";
import { RecentPosts } from "@/components/home/recent-posts";
import { CtaBanner } from "@/components/home/cta-banner";

export const metadata: Metadata = {
  title: "Car Importers — Premium Imported Vehicles UK",
  description:
    "Browse our curated selection of premium imported vehicles at competitive prices. Quality assured, UK-wide delivery, and flexible finance available.",
};

// JSON-LD Organization schema
const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Car Importers",
  url: "https://carimporters.co.uk",
  description:
    "Premium imported vehicles at competitive prices — Car Importers UK",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    availableLanguage: "English",
  },
};

export default async function HomePage() {
  const [featuredCars, makes, bodyTypes, posts] = await Promise.all([
    getFeaturedCars(8),
    getMakes(),
    getBodyTypes(),
    getRecentPosts(),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <HeroSection cars={featuredCars} />
      <QuickSearch makes={makes} bodyTypes={bodyTypes} />
      <FeaturedVehicles cars={featuredCars} />
      <BodyTypeBrowse bodyTypes={bodyTypes} />
      <BrandLogos makes={makes} />
      <ServicesSection />
      <LoanCalculator />
      <RecentPosts posts={posts} />
      <CtaBanner />
    </>
  );
}
