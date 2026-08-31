import "server-only"

import { COMPANY_API_BASE } from "@/lib/env"
import { apiFetch, bearer } from "./http"
import type {
  CompanyAccount,
  CompanyBatch,
  CompanyLoginResult,
  CompanyOverview,
} from "./types"

/**
 * Logistics-company API (`/company`).
 *
 * The backend team did not ship an OpenAPI document for this service, so the
 * surface below was probed directly against the deployment:
 *
 *   verified  POST /company/auth/register  { name, address, email, phone, password }
 *   verified  POST /company/auth/login     { email, password }
 *   present   GET  /company/auth/profile   (currently never responds)
 *   present   GET  /company/dashboard      (currently never responds)
 *   present   GET  /company/batches        (currently never responds)
 *   missing   everything else (batch creation, driver assignment, vehicles)
 *
 * The three "present" routes hang with and without an Authorization header, so
 * every read here relies on the client timeout and surfaces a retryable local
 * error instead of blocking the page. See .documentations/README-INTEGRATION.md.
 */

const base = COMPANY_API_BASE

/** Shorter than the global default: these routes are known to hang. */
const READ_TIMEOUT_MS = 8_000

export interface CompanyRegisterInput {
  name: string
  address: string
  email: string
  phone: string
  password: string
}

export async function companyRegister(
  input: CompanyRegisterInput
): Promise<CompanyAccount | null> {
  const { data } = await apiFetch<CompanyAccount>({
    baseUrl: base,
    path: "/auth/register",
    method: "POST",
    body: input,
  })
  return data ?? null
}

export async function companyLogin(
  email: string,
  password: string
): Promise<CompanyLoginResult> {
  const { data } = await apiFetch<CompanyLoginResult>({
    baseUrl: base,
    path: "/auth/login",
    method: "POST",
    body: { email, password },
  })
  return data
}

export async function getCompanyProfile(
  token: string
): Promise<CompanyAccount> {
  const { data } = await apiFetch<CompanyAccount>({
    baseUrl: base,
    path: "/auth/profile",
    headers: bearer(token),
    timeoutMs: READ_TIMEOUT_MS,
  })
  return data
}

export async function getCompanyOverview(
  token: string
): Promise<CompanyOverview> {
  const { data } = await apiFetch<CompanyOverview>({
    baseUrl: base,
    path: "/dashboard",
    headers: bearer(token),
    timeoutMs: READ_TIMEOUT_MS,
  })
  return data
}

export async function listCompanyBatches(
  token: string
): Promise<CompanyBatch[]> {
  const { data } = await apiFetch<CompanyBatch[]>({
    baseUrl: base,
    path: "/batches",
    headers: bearer(token),
    timeoutMs: READ_TIMEOUT_MS,
  })
  return Array.isArray(data) ? data : []
}

export interface CreateBatchInput {
  departure: string
  destination: string
  dropOffStartTime: string
  dropOffCloseTime: string
  batchNumber: string
}

/**
 * Not deployed yet — the call is written against the natural REST shape so it
 * starts working the moment the backend adds the route. Until then it returns
 * a `NOT_FOUND` `ApiError`, which the form renders as an explicit
 * "not available yet" message rather than a generic failure.
 */
export async function createBatch(
  token: string,
  input: CreateBatchInput
): Promise<CompanyBatch> {
  const { data } = await apiFetch<CompanyBatch>({
    baseUrl: base,
    path: "/batches",
    method: "POST",
    headers: bearer(token),
    body: input,
    timeoutMs: READ_TIMEOUT_MS,
  })
  return data
}

/** Not deployed yet — see `createBatch`. */
export async function assignDriverToBatch(
  token: string,
  batchId: string,
  vehicleRef: string
): Promise<unknown> {
  const { data } = await apiFetch<unknown>({
    baseUrl: base,
    path: `/batches/${encodeURIComponent(batchId)}/assign-driver`,
    method: "POST",
    headers: bearer(token),
    body: { vehicleRef },
    timeoutMs: READ_TIMEOUT_MS,
  })
  return data
}
