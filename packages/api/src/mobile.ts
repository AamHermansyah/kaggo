import "server-only"

import { DEFAULT_API_BASE_URL, apiFetch, riderIdentity } from "./http"
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
} from "@kaggo/types"

/**
 * Rider & Mobile API.
 */

const base = (process.env.API_BASE_URL ?? DEFAULT_API_BASE_URL).replace(/\/+$/, "")

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
  companyCode: string
  fromLabel: string
  toLabel: string
  itemName: string
  batchNumber?: string
}

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

/** Only the receiver may mark a parcel received. */
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
