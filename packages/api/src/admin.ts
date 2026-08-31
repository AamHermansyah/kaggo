import "server-only"

import { DEFAULT_API_BASE_URL, apiFetch, bearer, type PaginationMeta } from "./http"
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
} from "@kaggo/types"

/**
 * Admin portal API (`/admin`).
 */

const base = `${(process.env.API_BASE_URL ?? DEFAULT_API_BASE_URL).replace(/\/+$/, "")}/admin`

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
  companyId?: string
  imei?: string
  terminalNo: string
}

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

export const listBatches = (token: string, query: CursorQuery = {}) =>
  paginated<AdminBatch>("/logistics-batches", token, query)

export async function listCountries(token: string): Promise<CountrySetting[]> {
  const { data } = await apiFetch<CountrySetting[]>({
    baseUrl: base,
    path: "/settings/countries",
    headers: bearer(token),
  })
  return Array.isArray(data) ? data : []
}

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
