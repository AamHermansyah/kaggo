/**
 * Response shapes mirrored from the backend OpenAPI documents
 * (`.documentations/mobile-references.txt`, `.documentations/admin-references.txt`).
 *
 * Kept framework-free so both server and client modules can import them.
 */

export type ShipmentStatus =
  | "PENDING_PAYMENT"
  | "ACTIVE"
  | "RECEIVED"
  | "CANCELLED"

export type RangeFilter = "today" | "week" | "month" | "all"

/* ------------------------------------------------------------------ mobile */

export interface IdentifyResult {
  userId: string
  phoneNumber: string
  isNewUser: boolean
}

export interface VehicleLookup {
  vehicleId: string
  driverFullName: string
  driverPhone: string
  plateNumber: string
  colour: string
  make: string
  model: string
  companyName: string
  /** Whether the GPS tracker acknowledged the wake command. Never blocks listing. */
  deviceConnected: boolean
  batteryLevel: number | null
}

export interface CreateShipmentResult {
  shipmentId: string
  status: "PENDING_PAYMENT"
  priceAmount: number
  currency: string
}

export interface ShipmentPosition {
  lat: number
  lng: number
  at: string
}

export interface ShipmentEta {
  remainingSeconds: number
  estimatedArrival: string | null
}

export interface RiderShipment {
  shipmentId: string
  /** Whether the signed-in user is the sender or the receiver of this parcel. */
  indicator: "sender" | "receiver"
  itemName: string
  driverPhone: string
  vehicle: {
    plateNumber: string
    colour: string
    make: string
    model: string
    companyName: string
  }
  route: { from: string; to: string }
  status: ShipmentStatus
  arrivedAt: string | null
  /** Raw coordinates — the backend does no reverse geocoding. */
  currentStatus: ShipmentPosition | null
  eta: ShipmentEta | null
  createdAt: string
}

/**
 * `POST /shipments/{id}/pay` answers with a different shape per gateway, chosen
 * from the sender's resolved country (Nigeria -> Paystack, India -> Razorpay).
 * Discriminate on `provider` — Razorpay has no hosted checkout URL at all.
 */
export type PaymentInit =
  | {
      provider: "PAYSTACK"
      reference: string
      authorizationUrl: string
    }
  | {
      provider: "RAZORPAY"
      reference: string
      razorpayOrderId: string
      /** Public key for Razorpay's client-side Checkout SDK. */
      razorpayKeyId: string
    }

export type PaymentProvider = PaymentInit["provider"]

export interface PaymentVerification {
  shipmentId: string
  reference: string
  outcome: "success" | "failed" | "already_processed"
}

export interface PaymentReceipt {
  shipmentId: string
  itemName: string
  senderPhone: string
  receiverPhone: string
  route: { from: string; to: string }
  companyName: string
  amount: number
  currency: string
  paymentReference: string
  paidAt: string | null
  /** Which gateway processed the payment, for labelling the receipt. */
  provider?: PaymentProvider
}

/* ----------------------------------------------------- batch tracking (v1.1) */

export type BatchRequestStatus =
  | "WAITING_FOR_MATCH"
  | "MATCHED"
  | "ASSIGNED"
  | "TRACKING"
  | "ARRIVED"
  | "RECEIVED"
  | "CANCELLED"

export interface BatchRequestResult {
  requestId: string
  batchId: string
  itemName: string
  status: "WAITING_FOR_MATCH"
  /** Which batch the server actually matched — the caller never picks one. */
  matchedBatchNumber: string
  /** Departure time, which is later than the drop-off window. */
  scheduledDeparture: string | null
  createdAt: string
}

export interface BatchRequest {
  requestId: string
  batchId: string
  itemName: string
  status: BatchRequestStatus
  createdAt: string
}

/* ------------------------------------------------------------------- admin */

export type AdminRole = "ADMIN" | "SUPERADMIN"

export interface AdminAccount {
  id: string
  email: string
  role: AdminRole
}

export interface AdminLoginResult {
  token: string
  admin: AdminAccount
}

export interface AdminOverview {
  range: RangeFilter
  totalUsers: number
  totalVehicles: number
  totalShipments: number
  totalRevenue: number
  /** Added in v1.1. Excludes soft-deleted companies. */
  totalCompanies: number
}

export interface AdminUser {
  userId: string
  phoneNumber: string
  totalSent: number
  totalReceived: number
  createdAt: string
}

export interface AdminVehicle {
  vehicleId: string
  driverFullName: string
  driverPhone: string
  plateNumber: string
  colour: string
  make: string
  model: string
  companyName: string
  /**
   * Added in v1.1. The real link to a LogisticsCompany; `null` means the
   * vehicle is not tied to one. Informational only — the backend currently
   * lets any approved company assign any vehicle regardless of this field.
   */
  companyId: string | null
  status: "ACTIVE" | "INACTIVE"
  /** JT/T808 terminal number, not the manufacturer IMEI. */
  gpsDeviceId: string | null
  batteryLevel: number | null
  deviceStatus: "ON" | "OFF" | null
  lastSeenAt: string | null
}

export interface AdminShipment {
  shipmentId: string
  senderPhone: string
  receiverPhone: string
  itemName: string
  driverPhone: string
  vehiclePlateNumber: string
  route: { from: string; to: string }
  status: ShipmentStatus
  currentStatus: { lat: number; lng: number; at: string | null } | null
  priceAmount: number
  currency: string
  deletedAt: string | null
  createdAt: string
}

export interface AdminRevenue {
  range?: RangeFilter
  total?: number
  totalRevenue?: number
  currency?: string
  [key: string]: unknown
}

export interface AdminTransaction {
  reference?: string
  amount?: number
  currency?: string
  shipmentId?: string
  paidAt?: string | null
  createdAt?: string
  [key: string]: unknown
}

export interface CountrySetting {
  code: string
  name: string
  currency: string
  currencySymbol: string
  flatPrice: number
  active: boolean
}

export interface CompanyLocation {
  companyName?: string
  locationLabel?: string
  address?: string
  country?: string
  [key: string]: unknown
}

export interface CsvUploadResult {
  upserted?: number
  skipped?: Array<{ line?: number; reason?: string }>
  [key: string]: unknown
}

export type CompanyStatus = "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED"

/** `GET /admin/logistics-companies` row. */
export interface AdminCompany {
  companyId: string
  name: string
  /** 6-digit code end users type to join this company's batches. */
  companyCode: string
  phone: string
  email: string
  address: string
  status: CompanyStatus
  approvedAt: string | null
  rejectionReason: string | null
  suspensionReason: string | null
  createdAt: string
  vehicleCount: number
  /** RECEIVED-status batch-matched requests. */
  completedShipments: number
}

/**
 * `GET /admin/logistics-companies/{id}`.
 *
 * Carries a different pair of stats from the list row rather than replacing
 * them: `totalShipments` counts every request past WAITING_FOR_MATCH, which is
 * broader than the list's RECEIVED-only `completedShipments`.
 */
export interface AdminCompanyDetail extends AdminCompany {
  totalBatches: number
  totalShipments: number
}

export type BatchStatus =
  | "DRAFT"
  | "OPEN"
  | "READY"
  | "BROADCASTED"
  | "ACTIVE"
  | "COMPLETED"
  | "CANCELLED"

/** `GET /admin/logistics-batches` — cross-company view. */
export interface AdminBatch {
  batchId: string
  companyName: string
  route: { from: string; to: string }
  batchNumber: string
  status: BatchStatus
  driverFullName: string | null
  plateNumber: string | null
  matchedShipmentCount: number
  journeyStatus: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | null
  currentLocation: { lat: number; lng: number } | null
  createdAt: string
}

/* ----------------------------------------------------------------- company */

export interface CompanyAccount {
  id?: string
  name?: string
  email?: string
  phone?: string
  address?: string
  code?: string
  status?: string
  [key: string]: unknown
}

export interface CompanyLoginResult {
  token: string
  company?: CompanyAccount
  [key: string]: unknown
}

export interface CompanyOverview {
  companyName?: string
  companyCode?: string
  totalPackages?: number
  totalBatches?: number
  totalJourneys?: number
  totalCompleted?: number
  [key: string]: unknown
}

export interface CompanyBatch {
  id?: string
  batchNumber?: string | number
  from?: string
  to?: string
  departure?: string
  destination?: string
  packageCount?: number
  driverAssigned?: boolean
  departureTime?: string
  etaSeconds?: number
  [key: string]: unknown
}
