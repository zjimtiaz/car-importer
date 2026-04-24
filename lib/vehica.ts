// VEHICA API Client — fetches car data from WordPress VEHICA theme REST API

import type {
  VehicaCar,
  VehicaApiResponse,
  VehicaAttribute,
  VehicaImage,
  VehicaFilters,
  VehicaTaxonomyTerm,
  ParsedCar,
  VehicaLocation,
} from "./vehica-types";
import { VehicaAttrId } from "./vehica-types";
// Re-export types for consumers
export type {
  VehicaCar,
  VehicaApiResponse,
  VehicaAttribute,
  VehicaImage,
  VehicaFilters,
  VehicaTaxonomyTerm,
  ParsedCar,
};
export { VehicaAttrId } from "./vehica-types";

const baseUrl = process.env.WORDPRESS_URL;
const CACHE_TTL = 60; // 60 seconds — fast refresh for content changes
const USER_AGENT = "Next.js VEHICA Client";

// Attribute ID constants for quick access
const ATTR = {
  MAKE: 6659,
  MODEL: 6660,
  BODY_TYPE: 6655,
  PRICE: 6656,
  FUEL: 6663,
  TRANSMISSION: 6662,
  DRIVE_TYPE: 6661,
  ENGINE_SIZE: 6665,
  COLOR: 6666,
  YEAR: 14696,
  CONDITION: 6654,
  DOORS: 12770,
  MILEAGE: 6664,
  GALLERY: 6673,
  LOCATION: 16721,
  VIDEO: 6674,
} as const;

// ─── Helpers ────────────────────────────────────────────────

/** Get a raw attribute by numeric ID */
function getAttr(
  attributes: VehicaAttribute[],
  id: number
): VehicaAttribute | undefined {
  return attributes.find((a) => a.id === id);
}

/**
 * Get the display value of an attribute.
 * Handles all VEHICA attribute types:
 * - taxonomy: value is array of term objects → return first term's name
 * - number: value is a number → convert to string
 * - text: value is a string → return as-is
 * - price: value is object → use displayValue
 */
function getAttrValue(attributes: VehicaAttribute[], id: number): string {
  const attr = getAttr(attributes, id);
  if (!attr) return "";

  const val = attr.value;

  // Taxonomy fields: value is an array of term objects with .name
  if (attr.type === "taxonomy" && Array.isArray(val) && val.length > 0) {
    const first = val[0];
    if (typeof first === "object" && first !== null && "name" in first) {
      return first.name;
    }
    return String(first);
  }

  // Number fields: displayValue often has a formatted version (e.g. "3.8L")
  if (attr.type === "number") {
    if (attr.displayValue && typeof attr.displayValue === "string" && attr.displayValue.trim()) {
      return attr.displayValue;
    }
    if (val === "" || val === null || val === undefined) return "";
    return String(val);
  }

  // Text fields
  if (typeof val === "string") return val;
  if (typeof val === "number") return String(val);

  return "";
}

/** Get the slug of a taxonomy attribute */
function getAttrSlug(attributes: VehicaAttribute[], id: number): string {
  const attr = getAttr(attributes, id);
  if (!attr) return "";

  const val = attr.value;
  if (Array.isArray(val) && val.length > 0) {
    const first = val[0];
    if (typeof first === "object" && first !== null && "slug" in first) {
      return first.slug;
    }
  }
  return "";
}

/** Parse numeric price from attribute */
function parsePrice(attributes: VehicaAttribute[]): number {
  const attr = getAttr(attributes, ATTR.PRICE);
  if (!attr) return 0;

  const val = attr.value;

  // Price value is an object like { "vehica_currency_6656_2316": 62000 }
  if (typeof val === "object" && val !== null && !Array.isArray(val)) {
    const keys = Object.keys(val);
    if (keys.length > 0) {
      const num = val[keys[0]];
      return typeof num === "number" ? num : parseFloat(String(num)) || 0;
    }
  }

  // Fallback: try parsing as string/number
  if (typeof val === "number") return val;
  if (typeof val === "string") {
    const num = parseFloat(val.replace(/[^0-9.]/g, ""));
    return isNaN(num) ? 0 : num;
  }

  return 0;
}

/** Get formatted price display from API */
function getPriceDisplay(attributes: VehicaAttribute[]): string {
  const attr = getAttr(attributes, ATTR.PRICE);
  if (!attr) return "POA";

  // displayValue is like { "vehica_currency_6656_2316": "$62,000" }
  const dv = attr.displayValue;
  if (typeof dv === "object" && dv !== null && !Array.isArray(dv)) {
    const keys = Object.keys(dv);
    if (keys.length > 0) {
      const formatted = dv[keys[0]];
      if (typeof formatted === "string" && formatted.trim()) {
        return formatted;
      }
    }
  }

  // Fallback: format the numeric price
  const price = parsePrice(attributes);
  return formatPrice(price);
}

/** Format price for display */
function formatPrice(price: number): string {
  if (price === 0) return "POA";
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/** Extract gallery images from the gallery attribute */
function getGallery(attributes: VehicaAttribute[]): VehicaImage[] {
  const attr = getAttr(attributes, ATTR.GALLERY);
  if (!attr) return [];

  // Gallery attribute has an `images` array with { url, thumb }
  if (attr.images && Array.isArray(attr.images)) {
    return attr.images;
  }

  return [];
}

/** Extract location from the location attribute */
function getLocation(attributes: VehicaAttribute[]): VehicaLocation | null {
  const attr = getAttr(attributes, ATTR.LOCATION);
  if (!attr) return null;

  const val = attr.value;
  if (typeof val === "object" && val !== null && "address" in val) {
    return {
      address: val.address || "",
      lat: val.position?.lat || 0,
      lng: val.position?.lng || 0,
    };
  }

  return null;
}

// ─── Parse Car ──────────────────────────────────────────────

/** Normalize a raw VehicaCar into a flat, typed ParsedCar */
export function parseCar(car: VehicaCar): ParsedCar {
  const attrs = car.attributes || [];
  const price = parsePrice(attrs);
  const gallery = getGallery(attrs);
  const location = getLocation(attrs);

  return {
    id: car.id,
    name: car.name,
    slug: car.slug,
    link: car.url || "",
    date: "",
    modified: "",
    featured: car.featured || false,
    description: car.description || "",

    make: getAttrValue(attrs, ATTR.MAKE),
    makeSlug: getAttrSlug(attrs, ATTR.MAKE),
    model: getAttrValue(attrs, ATTR.MODEL),
    modelSlug: getAttrSlug(attrs, ATTR.MODEL),
    year: getAttrValue(attrs, ATTR.YEAR),
    price,
    priceDisplay: getPriceDisplay(attrs),
    bodyType: getAttrValue(attrs, ATTR.BODY_TYPE),
    bodyTypeSlug: getAttrSlug(attrs, ATTR.BODY_TYPE),
    fuelType: getAttrValue(attrs, ATTR.FUEL),
    transmission: getAttrValue(attrs, ATTR.TRANSMISSION),
    driveType: getAttrValue(attrs, ATTR.DRIVE_TYPE),
    engineSize: getAttrValue(attrs, ATTR.ENGINE_SIZE),
    color: getAttrValue(attrs, ATTR.COLOR),
    condition: getAttrValue(attrs, ATTR.CONDITION),
    doors: getAttrValue(attrs, ATTR.DOORS),
    mileage: getAttrValue(attrs, ATTR.MILEAGE),

    gallery,
    mainImage: gallery[0]?.url || "/placeholder-car.jpg",
    thumbnail: gallery[0]?.thumb || gallery[0]?.url || "/placeholder-car.jpg",

    location,

    videoUrl: getVideoUrl(attrs),
    videoEmbed: getVideoEmbed(attrs),

    attributes: attrs,
  };
}

/** Extract video URL from embed attribute */
function getVideoUrl(attributes: VehicaAttribute[]): string {
  const attr = getAttr(attributes, ATTR.VIDEO);
  if (!attr) return "";
  const val = attr.value;
  if (typeof val === "object" && val !== null && !Array.isArray(val) && "url" in val) {
    return (val as { url: string }).url || "";
  }
  return "";
}

/** Extract video embed HTML from embed attribute */
function getVideoEmbed(attributes: VehicaAttribute[]): string {
  const attr = getAttr(attributes, ATTR.VIDEO);
  if (!attr) return "";
  const val = attr.value;
  if (typeof val === "object" && val !== null && !Array.isArray(val) && "embed" in val) {
    return (val as { embed: string }).embed || "";
  }
  if (typeof attr.displayValue === "string") return attr.displayValue;
  return "";
}

// ─── API Fetchers ───────────────────────────────────────────

async function vehicaFetch<T>(
  path: string,
  query?: Record<string, string | number | undefined>,
  tags: string[] = ["vehica-cars"]
): Promise<T> {
  if (!baseUrl) throw new Error("WORDPRESS_URL not configured");

  const params = new URLSearchParams();
  if (query) {
    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined && v !== "") params.set(k, String(v));
    });
  }

  const qs = params.toString();
  const url = `${baseUrl}/wp-json${path}${qs ? `?${qs}` : ""}`;

  const res = await fetch(url, {
    headers: { "User-Agent": USER_AGENT },
    next: { tags, revalidate: CACHE_TTL },
    signal: AbortSignal.timeout(15000),
  });

  if (!res.ok) {
    throw new Error(`VEHICA API error ${res.status}: ${res.statusText} — ${url}`);
  }

  return res.json();
}

async function vehicaFetchGraceful<T>(
  path: string,
  fallback: T,
  query?: Record<string, string | number | undefined>,
  tags?: string[]
): Promise<T> {
  if (!baseUrl) return fallback;
  try {
    return await vehicaFetch<T>(path, query, tags);
  } catch (e) {
    console.warn(`VEHICA fetch failed for ${path}:`, e);
    return fallback;
  }
}

// ─── Cars ───────────────────────────────────────────────────

/** Fetch all cars (with optional filters) from /vehica/v1/cars */
export async function getVehicaCars(
  filters?: VehicaFilters
): Promise<ParsedCar[]> {
  const query: Record<string, string | number | undefined> = {};

  // VEHICA API uses taxonomy names as filter params (not vehica_XXXX IDs)
  if (filters?.make) query["make"] = filters.make;
  if (filters?.model) query["model"] = filters.model;
  if (filters?.bodyType) query["type"] = filters.bodyType;
  if (filters?.fuelType) query["fuel-type"] = filters.fuelType;
  if (filters?.transmission) query["transmission"] = filters.transmission;
  if (filters?.condition) query["condition"] = filters.condition;
  if (filters?.color) query["color"] = filters.color;
  if (filters?.driveType) query["drive-type"] = filters.driveType;
  if (filters?.priceFrom) query["price_from"] = filters.priceFrom;
  if (filters?.priceTo) query["price_to"] = filters.priceTo;
  if (filters?.yearFrom) query["year_from"] = filters.yearFrom;
  if (filters?.yearTo) query["year_to"] = filters.yearTo;
  // Always fetch up to 100 cars unless a specific limit is set
  query["limit"] = filters?.perPage || 100;
  if (filters?.page) query["page"] = filters.page;

  const data = await vehicaFetchGraceful<VehicaApiResponse>(
    "/vehica/v1/cars",
    { resultsCount: 0, results: [] },
    query
  );

  let cars = data.results.map(parseCar);

  // Client-side filtering for price and year (VEHICA API may not support these)
  if (filters?.priceFrom) {
    const min = Number(filters.priceFrom);
    if (!isNaN(min)) cars = cars.filter((c) => c.price >= min);
  }
  if (filters?.priceTo) {
    const max = Number(filters.priceTo);
    if (!isNaN(max)) cars = cars.filter((c) => c.price <= max);
  }
  if (filters?.yearFrom) {
    const minYear = Number(filters.yearFrom);
    if (!isNaN(minYear)) cars = cars.filter((c) => Number(c.year) >= minYear);
  }
  if (filters?.yearTo) {
    const maxYear = Number(filters.yearTo);
    if (!isNaN(maxYear)) cars = cars.filter((c) => Number(c.year) <= maxYear);
  }

  // Client-side sort (VEHICA API may not support sorting)
  if (filters?.sort) {
    switch (filters.sort) {
      case "price_low":
        cars.sort((a, b) => a.price - b.price);
        break;
      case "price_high":
        cars.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        cars.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        break;
      case "oldest":
        cars.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        break;
      case "mileage_low":
        cars.sort(
          (a, b) =>
            parseInt(String(a.mileage).replace(/\D/g, "") || "0") -
            parseInt(String(b.mileage).replace(/\D/g, "") || "0")
        );
        break;
    }
  }

  return cars;
}

/** Fetch a single car by slug */
export async function getVehicaCarBySlug(
  slug: string
): Promise<ParsedCar | null> {
  // VEHICA API doesn't support ?slug= filter — fetch all and match client-side
  const allCars = await getVehicaCars({ perPage: 200 });
  return allCars.find((c) => c.slug === slug) || null;
}

/** Fetch all car slugs for generateStaticParams */
export async function getAllCarSlugs(): Promise<{ slug: string }[]> {
  const data = await vehicaFetchGraceful<VehicaApiResponse>(
    "/vehica/v1/cars",
    { resultsCount: 0, results: [] },
    { limit: 100 }
  );
  return data.results.map((car) => ({ slug: car.slug }));
}

/** Get featured cars — only returns cars marked as featured */
export async function getFeaturedCars(limit = 8): Promise<ParsedCar[]> {
  const cars = await getVehicaCars();
  return cars.filter((c) => c.featured).slice(0, limit);
}

/** Get related cars (same make or body type, excluding current) */
export async function getRelatedCars(
  car: ParsedCar,
  limit = 4
): Promise<ParsedCar[]> {
  const allCars = await getVehicaCars();
  const related = allCars
    .filter(
      (c) =>
        c.id !== car.id &&
        (c.makeSlug === car.makeSlug || c.bodyTypeSlug === car.bodyTypeSlug)
    )
    .slice(0, limit);

  // If not enough related, fill with other cars
  if (related.length < limit) {
    const others = allCars
      .filter(
        (c) => c.id !== car.id && !related.some((r) => r.id === c.id)
      )
      .slice(0, limit - related.length);
    return [...related, ...others];
  }

  return related;
}

// ─── Taxonomy fetchers ──────────────────────────────────────

/** Fetch taxonomy terms from /wp/v2/vehica_XXXX */
async function getTaxonomyTerms(
  taxonomy: string
): Promise<VehicaTaxonomyTerm[]> {
  return vehicaFetchGraceful<VehicaTaxonomyTerm[]>(
    `/wp/v2/${taxonomy}`,
    [],
    { per_page: "100" },
    ["vehica-taxonomies"]
  );
}

export async function getMakes(): Promise<VehicaTaxonomyTerm[]> {
  return getTaxonomyTerms("vehica_6659");
}

export async function getModels(
  makeId?: number
): Promise<VehicaTaxonomyTerm[]> {
  const terms = await getTaxonomyTerms("vehica_6660");
  if (makeId) return terms.filter((t) => t.parent === makeId);
  return terms;
}

export async function getBodyTypes(): Promise<VehicaTaxonomyTerm[]> {
  return getTaxonomyTerms("vehica_6655");
}

export async function getFuelTypes(): Promise<VehicaTaxonomyTerm[]> {
  return getTaxonomyTerms("vehica_6663");
}

export async function getTransmissions(): Promise<VehicaTaxonomyTerm[]> {
  return getTaxonomyTerms("vehica_6662");
}

export async function getDriveTypes(): Promise<VehicaTaxonomyTerm[]> {
  return getTaxonomyTerms("vehica_6661");
}

export async function getColors(): Promise<VehicaTaxonomyTerm[]> {
  return getTaxonomyTerms("vehica_6666");
}

export async function getConditions(): Promise<VehicaTaxonomyTerm[]> {
  return getTaxonomyTerms("vehica_6654");
}

/** Get all filter options in one call */
export async function getAllFilterOptions() {
  const [makes, models, bodyTypes, fuelTypes, transmissions, conditions, colors] =
    await Promise.all([
      getMakes(),
      getModels(),
      getBodyTypes(),
      getFuelTypes(),
      getTransmissions(),
      getConditions(),
      getColors(),
    ]);

  return { makes, models, bodyTypes, fuelTypes, transmissions, conditions, colors };
}
