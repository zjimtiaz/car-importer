// VEHICA WordPress Theme — API Types
// Attribute IDs from /vehica/v1/cars response

/** Numeric attribute IDs used in the VEHICA attributes[] array */
export enum VehicaAttrId {
  Make = 6659,
  Model = 6660,
  BodyType = 6655,
  Price = 6656,
  FuelType = 6663,
  Transmission = 6662,
  DriveType = 6661,
  EngineSize = 6665,
  Color = 6666,
  Year = 14696,
  Condition = 6654,
  Doors = 12770,
  Mileage = 6664,
  Gallery = 6673,
  Location = 16721,
  Video = 6674,
  Features = 6670,
  SafetyFeatures = 12723,
  OfferType = 6657,
  Cylinders = 12974,
  VIN = 6671,
}

/** Taxonomy term object inside attribute value arrays */
export interface VehicaTermValue {
  id: number;
  key: string;
  name: string;
  slug: string;
  link: string;
  postsNumber: number;
  type: string;
  parentTerm: false | number[];
  carsEndpoint: string;
  taxonomy: string;
  taxonomyKey: string;
}

/**
 * Raw attribute from VEHICA API.
 * `value` can be:
 * - string (text fields like VIN, mileage)
 * - number (number fields like year, engine size)
 * - VehicaTermValue[] (taxonomy fields like make, model, fuel)
 * - { [key: string]: number } (price fields)
 * - { address: string, position: { lat, lng } } (location)
 * - { url: string, embed: string } (video/embed)
 * - number[] (gallery — media IDs)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface VehicaAttribute {
  id: number;
  name: string;
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  displayValue: any;
  /** Only present on gallery-type attributes */
  images?: VehicaImage[];
}

/** Gallery image from VEHICA API */
export interface VehicaImage {
  url: string;
  thumb: string;
}

/** Location data from VEHICA API */
export interface VehicaLocation {
  address: string;
  lat: number;
  lng: number;
}

/** Raw car from /vehica/v1/cars response */
export interface VehicaCar {
  id: number;
  name: string;
  slug: string;
  url: string;
  description?: string;
  attributes: VehicaAttribute[];
  user: number;
  featured: boolean;
}

/** VEHICA API response wrapper */
export interface VehicaApiResponse {
  resultsCount: number;
  results: VehicaCar[];
}

/** Normalized car data for frontend components */
export interface ParsedCar {
  id: number;
  name: string;
  slug: string;
  link: string;
  date: string;
  modified: string;
  featured: boolean;
  description: string;

  // Core specs (extracted from attributes)
  make: string;
  makeSlug: string;
  model: string;
  modelSlug: string;
  year: string;
  price: number;
  priceDisplay: string;
  bodyType: string;
  bodyTypeSlug: string;
  fuelType: string;
  transmission: string;
  driveType: string;
  engineSize: string;
  color: string;
  condition: string;
  doors: string;
  mileage: string;

  // Media
  gallery: VehicaImage[];
  mainImage: string;
  thumbnail: string;

  // Location
  location: VehicaLocation | null;

  // Raw for anything else
  attributes: VehicaAttribute[];
}

/** Filter parameters for /vehica/v1/cars */
export interface VehicaFilters {
  make?: string;
  model?: string;
  bodyType?: string;
  fuelType?: string;
  transmission?: string;
  condition?: string;
  color?: string;
  driveType?: string;
  yearFrom?: string;
  yearTo?: string;
  priceFrom?: string;
  priceTo?: string;
  sort?: "newest" | "oldest" | "price_low" | "price_high" | "mileage_low";
  page?: number;
  perPage?: number;
}

/** Taxonomy term (from /wp/v2/vehica_XXXX) */
export interface VehicaTaxonomyTerm {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  parent: number;
}
