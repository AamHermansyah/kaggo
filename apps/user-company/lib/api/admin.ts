import "server-only"

import { ADMIN_API_BASE } from "@/lib/env"
import { apiFetch, bearer, type PaginationMeta } from "./http"
import type {
  AdminBatch,
  AdminCompany,
  AdminCompanyDetail,
  AdminLoginResult,
  AdminOverview,
  AdminRevenue,
  AdminShipment,
  AdminTransaction,
  AdminUser,
  AdminVehicle,
  CompanyLocation,
  CountrySetting,
  CsvUploadResult,
  RangeFilter,
} from "./types"

/**
 * Admin portal API (`/admin`). Email + password login, JWT bearer afterwards.
 * There is no public registration endpoint — accounts are provisioned by the
 * backend team.
 */

const base = ADMIN_API_BASE

export interface Paginated<T> {
  items: T[]
  pagination?: PaginationMeta
}

export interface CursorQuery {
  cursor?: string
  limit?: number
}

async function paginated<T>(
  path: string,
  token: string,
  query: CursorQuery
): Promise<Paginated<T>> {
  const { data, meta } = await apiFetch<T[]>({
    baseUrl: base,
    path,
    headers: bearer(token),
    query: { cursor: query.cursor, limit: query.limit ?? 20 },
  })
  return {
    items: Array.isArray(data) ? data : [],
    pagination: meta?.pagination,
  }
}

export async function adminLogin(
  email: string,
  password: string
): Promise<AdminLoginResult> {
  const { data } = await apiFetch<AdminLoginResult>({
    baseUrl: base,
    path: "/auth/login",
    method: "POST",
    body: { email, password },
  })
  return data
}

export async function getOverview(
  token: string,
  range: RangeFilter = "all"
): Promise<AdminOverview> {
  const { data } = await apiFetch<AdminOverview>({
    baseUrl: base,
    path: "/overview",
    headers: bearer(token),
    query: { range },
  })
  return data
}

export const listUsers = (token: string, query: CursorQuery = {}) =>
  paginated<AdminUser>("/users", token, query)

export const listVehicles = (token: string, query: CursorQuery = {}) =>
  paginated<AdminVehicle>("/vehicles", token, query)

export const listShipments = (token: string, query: CursorQuery = {}) =>
  paginated<AdminShipment>("/shipments", token, query)

export const listTransactions = (token: string, query: CursorQuery = {}) =>
  paginated<AdminTransaction>("/revenue/transactions", token, query)

export async function getRevenue(
  token: string,
  range: RangeFilter = "all"
): Promise<AdminRevenue> {
  const { data } = await apiFetch<AdminRevenue>({
    baseUrl: base,
    path: "/revenue",
    headers: bearer(token),
    query: { range },
  })
  return data
}

export interface OnboardVehicleInput {
  driverFullName: string
  driverPhone: string
  plateNumber: string
  colour: string
  make: string
  model: string
  companyName: string
  /** Optional since v1.1: ties the vehicle to a real LogisticsCompany. */
  companyId?: string
  /** Manufacturer hardware identity. */
  imei?: string
  /** JT/T808 addressing ID, 1-12 digits. */
  terminalNo: string
}

/** Creates the GpsDevice and Vehicle rows together in one transaction. */
export async function onboardVehicle(
  token: string,
  input: OnboardVehicleInput
): Promise<AdminVehicle> {
  const { data } = await apiFetch<AdminVehicle>({
    baseUrl: base,
    path: "/vehicles",
    method: "POST",
    headers: bearer(token),
    body: input,
  })
  return data
}

export interface EditVehicleInput {
  driverFullName?: string
  driverPhone?: string
  colour?: string
  make?: string
  model?: string
  companyName?: string
  status?: "ACTIVE" | "INACTIVE"
  gpsDeviceId?: string | null
  /** `null` explicitly un-associates the vehicle from its company. */
  companyId?: string | null
}

export async function editVehicle(
  token: string,
  vehicleId: string,
  input: EditVehicleInput
): Promise<AdminVehicle> {
  const { data } = await apiFetch<AdminVehicle>({
    baseUrl: base,
    path: `/vehicles/${encodeURIComponent(vehicleId)}`,
    method: "PATCH",
    headers: bearer(token),
    body: input,
  })
  return data
}

/* ------------------------------------------------- logistics companies (v1.1) */

export const listCompanies = (token: string, query: CursorQuery = {}) =>
  paginated<AdminCompany>("/logistics-companies", token, query)

export async function getCompany(
  token: string,
  companyId: string
): Promise<AdminCompanyDetail> {
  const { data } = await apiFetch<AdminCompanyDetail>({
    baseUrl: base,
    path: `/logistics-companies/${encodeURIComponent(companyId)}`,
    headers: bearer(token),
  })
  return data
}

/** Lets a PENDING company log in and operate. Any authenticated admin may. */
export async function approveCompany(
  token: string,
  companyId: string
): Promise<void> {
  await apiFetch<unknown>({
    baseUrl: base,
    path: `/logistics-companies/${encodeURIComponent(companyId)}/approve`,
    method: "POST",
    headers: bearer(token),
  })
}

/** Any authenticated admin may reject. */
export async function rejectCompany(
  token: string,
  companyId: string,
  reason: string
): Promise<void> {
  await apiFetch<unknown>({
    baseUrl: base,
    path: `/logistics-companies/${encodeURIComponent(companyId)}/reject`,
    method: "POST",
    headers: bearer(token),
    body: { reason },
  })
}

/** SUPERADMIN only — halts an entire business. A plain ADMIN gets 401. */
export async function suspendCompany(
  token: string,
  companyId: string,
  reason: string
): Promise<void> {
  await apiFetch<unknown>({
    baseUrl: base,
    path: `/logistics-companies/${encodeURIComponent(companyId)}/suspend`,
    method: "POST",
    headers: bearer(token),
    body: { reason },
  })
}

/** SUPERADMIN only. Returns a SUSPENDED or REJECTED company to APPROVED. */
export async function reactivateCompany(
  token: string,
  companyId: string
): Promise<void> {
  await apiFetch<unknown>({
    baseUrl: base,
    path: `/logistics-companies/${encodeURIComponent(companyId)}/reactivate`,
    method: "POST",
    headers: bearer(token),
  })
}

/**
 * SUPERADMIN only, and irreversible: there is no un-delete endpoint. The
 * company disappears from every query including its own login, though its
 * vehicles, batches and past shipments are preserved.
 */
export async function deleteCompany(
  token: string,
  companyId: string,
  reason: string
): Promise<void> {
  await apiFetch<unknown>({
    baseUrl: base,
    path: `/logistics-companies/${encodeURIComponent(companyId)}`,
    method: "DELETE",
    headers: bearer(token),
    body: { reason },
  })
}

/** Cross-company view of every batch on the platform. */
export const listBatches = (token: string, query: CursorQuery = {}) =>
  paginated<AdminBatch>("/logistics-batches", token, query)

/* ------------------------------------------------------------------ settings */

export async function listCountries(token: string): Promise<CountrySetting[]> {
  const { data } = await apiFetch<CountrySetting[]>({
    baseUrl: base,
    path: "/settings/countries",
    headers: bearer(token),
  })
  return Array.isArray(data) ? data : []
}

/** SUPERADMIN only since v1.1 — system-wide pricing. A plain ADMIN gets 401. */
export async function updateCountryPricing(
  token: string,
  code: string,
  flatPrice: number
): Promise<CountrySetting> {
  const { data } = await apiFetch<CountrySetting>({
    baseUrl: base,
    path: `/settings/countries/${encodeURIComponent(code)}`,
    method: "PATCH",
    headers: bearer(token),
    body: { flatPrice },
  })
  return data
}

export async function listCompanyLocations(
  token: string,
  country = "NG"
): Promise<CompanyLocation[]> {
  const { data } = await apiFetch<CompanyLocation[]>({
    baseUrl: base,
    path: "/settings/company-locations",
    headers: bearer(token),
    query: { country },
  })
  return Array.isArray(data) ? data : []
}

/**
 * Idempotent bulk upsert. Malformed rows are skipped and reported by line
 * number rather than aborting the whole upload.
 */
export async function uploadCompanyLocations(
  token: string,
  csv: string,
  country = "NG"
): Promise<CsvUploadResult> {
  const { data } = await apiFetch<CsvUploadResult>({
    baseUrl: base,
    path: "/settings/company-locations/csv",
    method: "POST",
    headers: bearer(token),
    query: { country },
    body: { csv },
  })
  return data
}
