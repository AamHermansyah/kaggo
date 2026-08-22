import "server-only"

import { MOBILE_API_BASE } from "@/lib/env"
import { apiFetch, riderIdentity } from "./http"
import type {
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
  input: VehicleLookupInput
): Promise<VehicleLookup> {
  const { data } = await apiFetch<VehicleLookup>({
    baseUrl: base,
    path: "/vehicles/lookup",
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

export async function listShipments(userId: string): Promise<RiderShipment[]> {
  const { data } = await apiFetch<RiderShipment[]>({
    baseUrl: base,
    path: "/shipments",
    headers: riderIdentity(userId),
  })
  return Array.isArray(data) ? data : []
}

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
export async function verifyPayment(
  userId: string,
  shipmentId: string,
  reference: string
): Promise<PaymentVerification> {
  const { data } = await apiFetch<PaymentVerification>({
    baseUrl: base,
    path: `/shipments/${encodeURIComponent(shipmentId)}/verify-payment`,
    method: "POST",
    headers: riderIdentity(userId),
    body: { reference },
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
