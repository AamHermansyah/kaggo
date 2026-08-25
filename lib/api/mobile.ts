import "server-only"

import { MOBILE_API_BASE } from "@/lib/env"
import { apiFetch, riderIdentity } from "./http"
import type {
  BatchRequest,
  BatchRequestResult,
  CreateShipmentResult,
  IdentifyResult,
  PaymentInit,
  PaymentReceipt,
  PaymentVerification,
  RiderShipment,
  VehicleLookup,
} from "./types"

/**
 * Rider-facing API (`/`).
 *
 * Identity is a plain `x-user-id` header resolved by `POST /users/identify` —
 * there is no session token. See `lib/auth/signing.ts` for why the cookie that
 * carries it is signed.
 */

const base = MOBILE_API_BASE

export interface IdentifyInput {
  phoneNumber: string
  /** Only required after a 409 `DEVICE_VERIFICATION_REQUIRED`. */
  lastCounterpartyPhone?: string
}

export async function identifyUser(input: IdentifyInput): Promise<IdentifyResult> {
  const { data } = await apiFetch<IdentifyResult>({
    baseUrl: base,
    path: "/users/identify",
    method: "POST",
    body: input,
  })
  return data
}

export interface VehicleLookupInput {
  driverPhone?: string
  plateNumber?: string
}

/**
 * Looks a vehicle up while the listing form is being filled in and wakes its
 * GPS tracker. `deviceConnected: false` is informational — it must not block
 * the listing.
 */
export async function lookupVehicle(
  userId: string,
  input: VehicleLookupInput
): Promise<VehicleLookup> {
  const { data } = await apiFetch<VehicleLookup>({
    baseUrl: base,
    path: "/vehicles/lookup",
    // v1.1 made this endpoint authenticated; it answered 401 without the header.
    headers: riderIdentity(userId),
    query: { driverPhone: input.driverPhone, plateNumber: input.plateNumber },
  })
  return data
}

export interface CreateShipmentInput {
  senderPhoneNumber: string
  receiverPhoneNumber: string
  itemName: string
  driverPhone: string
  vehiclePlateNumber: string
  fromAddress: string
  toAddress: string
  fromLat: number
  fromLng: number
  toLat: number
  toLng: number
}

export async function createShipment(
  userId: string,
  input: CreateShipmentInput
): Promise<CreateShipmentResult> {
  const { data } = await apiFetch<CreateShipmentResult>({
    baseUrl: base,
    path: "/shipments",
    method: "POST",
    headers: riderIdentity(userId),
    body: input,
  })
  return data
}

export interface ShipmentPage {
  items: RiderShipment[]
  nextCursor: string | null
  hasMore: boolean
}

/** Cursor-paginated since v1.1. */
export async function listShipments(
  userId: string,
  query: { cursor?: string; limit?: number } = {}
): Promise<ShipmentPage> {
  const { data, meta } = await apiFetch<RiderShipment[]>({
    baseUrl: base,
    path: "/shipments",
    headers: riderIdentity(userId),
    query: { cursor: query.cursor, limit: query.limit ?? 20 },
  })
  return {
    items: Array.isArray(data) ? data : [],
    nextCursor: meta?.pagination?.nextCursor ?? null,
    hasMore: Boolean(meta?.pagination?.hasMore),
  }
}

/**
 * Either the sender or the receiver may pay (widened in v1.1).
 *
 * `callbackUrl` only means anything on the Paystack path; a Razorpay shipment
 * ignores it and answers with order ids instead of a checkout URL.
 */
export async function initializePayment(
  userId: string,
  shipmentId: string,
  callbackUrl: string
): Promise<PaymentInit> {
  const { data } = await apiFetch<PaymentInit>({
    baseUrl: base,
    path: `/shipments/${encodeURIComponent(shipmentId)}/pay`,
    method: "POST",
    headers: riderIdentity(userId),
    body: { callbackUrl },
  })
  return data
}

/**
 * Client-triggered verification. Idempotent: safe even when Paystack's webhook
 * already processed the same reference.
 */
/**
 * Verifies the shipment's own latest stored payment attempt.
 *
 * v1.1 dropped the request body: passing a client-supplied reference is no
 * longer possible, and either party to the shipment may call it.
 */
export async function verifyPayment(
  userId: string,
  shipmentId: string
): Promise<PaymentVerification> {
  const { data } = await apiFetch<PaymentVerification>({
    baseUrl: base,
    path: `/shipments/${encodeURIComponent(shipmentId)}/verify-payment`,
    method: "POST",
    headers: riderIdentity(userId),
  })
  return data
}

export async function getPaymentReceipt(
  userId: string,
  shipmentId: string
): Promise<PaymentReceipt> {
  const { data } = await apiFetch<PaymentReceipt>({
    baseUrl: base,
    path: `/shipments/${encodeURIComponent(shipmentId)}/payment-receipt`,
    headers: riderIdentity(userId),
  })
  return data
}

export interface BatchRequestInput {
  /** The logistics company's 6-digit code. */
  companyCode: string
  fromLabel: string
  toLabel: string
  itemName: string
  /**
   * Omit for the normal flow: the server matches whichever batch on the route
   * has an open drop-off window right now. Only supply it for the legacy
   * explicit-batch path.
   */
  batchNumber?: string
}

/**
 * Drop a package off with a logistics company.
 *
 * Single-party: the caller becomes both sender and receiver on the resulting
 * shipment, so there is no counterparty field.
 */
export async function submitBatchRequest(
  userId: string,
  input: BatchRequestInput
): Promise<BatchRequestResult> {
  const { data } = await apiFetch<BatchRequestResult>({
    baseUrl: base,
    path: "/batch-tracking/request",
    method: "POST",
    headers: riderIdentity(userId),
    body: input,
  })
  return data
}

export async function listBatchRequests(
  userId: string
): Promise<BatchRequest[]> {
  const { data } = await apiFetch<BatchRequest[]>({
    baseUrl: base,
    path: "/batch-tracking/my-requests",
    headers: riderIdentity(userId),
  })
  return Array.isArray(data) ? data : []
}

/** Only the receiver may mark a parcel received — the backend enforces it. */
export async function markShipmentReceived(
  userId: string,
  shipmentId: string
): Promise<void> {
  await apiFetch<unknown>({
    baseUrl: base,
    path: `/shipments/${encodeURIComponent(shipmentId)}/received`,
    method: "POST",
    headers: riderIdentity(userId),
  })
}
