/**
 * Demo supplier coordinates — used when real backend location data is unavailable.
 * Each entry matches an email from data.sql and gives realistic Indian city coords.
 */

export interface SupplierLocation {
  email: string;
  name: string;
  lat: number;
  lng: number;
  city: string;
}

export const SUPPLIER_COORDS: SupplierLocation[] = [
  { email: "freshfarms@gmail.com",        name: "Fresh Farms Produce",  lat: 20.0059, lng: 73.7997, city: "Nashik" },
  { email: "punjabcoldstorage@gmail.com", name: "Punjab Cold Storage",  lat: 30.9010, lng: 75.8573, city: "Ludhiana" },
  { email: "premium.greens@fssai.in",     name: "Premium Greens",       lat: 18.5204, lng: 73.8567, city: "Pune" },
  { email: "organic.mumbai@outlook.com",  name: "Organic Mumbai",       lat: 19.0760, lng: 72.8777, city: "Mumbai" },
  { email: "delhimandi@yahoo.in",         name: "Delhi Mandi Traders",  lat: 28.6519, lng: 77.2315, city: "Delhi" },
  { email: "quality.agro@domain.com",     name: "Quality Agro",         lat: 21.1458, lng: 79.0882, city: "Nagpur" },
];

/** Default fallback location if geolocation is denied — Indore, MP */
export const DEFAULT_CENTER: [number, number] = [22.7196, 75.8577];

/**
 * Haversine formula — returns distance in kilometres between two lat/lng points.
 */
export function haversineKm(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Returns the SupplierLocation for a given email, or undefined if not mapped.
 */
export function getSupplierCoords(email: string): SupplierLocation | undefined {
  return SUPPLIER_COORDS.find((s) => s.email === email);
}
