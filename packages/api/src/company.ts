import "server-only"

import { DEFAULT_API_BASE_URL, apiFetch, bearer } from "./http"
import type {
  CompanyAccount,
  CompanyBatch,
  CompanyLoginResult,
  CompanyOverview,
} from "@kaggo/types"

/**
 * Logistics-company API (`/company`).
 */

const base = `${(process.env.API_BASE_URL ?? DEFAULT_API_BASE_URL).replace(/\/+$/, "")}/company`

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
  fromLabel: string
  fromLat: number
  fromLng: number
  toLabel: string
  toLat: number
  toLng: number
  dropOffStartTime: string
  dropOffCloseTime: string
  batchNumber: string
}

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
