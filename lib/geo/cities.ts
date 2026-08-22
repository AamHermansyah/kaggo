/**
 * Route gazetteer.
 *
 * `POST /shipments` requires `fromLat/fromLng/toLat/toLng`, but the backend
 * ships no geocoding provider ("no reverse-geocoding provider in scope" — see
 * the mobile OpenAPI notes). Rather than invent an address lookup, the listing
 * form offers the cities Kaggo actually covers — the same list the landing page
 * advertises — and each carries its own coordinates.
 */

export interface City {
  id: string
  label: string
  state: string
  lat: number
  lng: number
}

export const CITIES: readonly City[] = [
  { id: "lagos", label: "Lagos", state: "Lagos", lat: 6.5244, lng: 3.3792 },
  { id: "benin", label: "Benin City", state: "Edo", lat: 6.335, lng: 5.6037 },
  { id: "ibadan", label: "Ibadan", state: "Oyo", lat: 7.3775, lng: 3.947 },
  { id: "abuja", label: "Abuja", state: "FCT", lat: 9.0765, lng: 7.3986 },
  { id: "akure", label: "Akure", state: "Ondo", lat: 7.2571, lng: 5.2058 },
  {
    id: "port-harcourt",
    label: "Port Harcourt",
    state: "Rivers",
    lat: 4.8156,
    lng: 7.0498,
  },
  { id: "enugu", label: "Enugu", state: "Enugu", lat: 6.4584, lng: 7.5464 },
  { id: "kano", label: "Kano", state: "Kano", lat: 12.0022, lng: 8.592 },
  { id: "abeokuta", label: "Abeokuta", state: "Ogun", lat: 7.1475, lng: 3.3619 },
  { id: "jos", label: "Jos", state: "Plateau", lat: 9.8965, lng: 8.8583 },
] as const

export const CITY_IDS = CITIES.map((city) => city.id)

const BY_ID = new Map(CITIES.map((city) => [city.id, city]))

export function findCity(id: string | undefined | null): City | undefined {
  return id ? BY_ID.get(id) : undefined
}

/** Label shown on the landing page and used as the shipment address string. */
export function cityLabel(id: string): string {
  return findCity(id)?.label ?? id
}
