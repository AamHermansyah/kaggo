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

export interface PaymentInit {
  reference: string
  authorizationUrl: string
}

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
}

/* ------------------------------------------------------------------- admin */

export interface AdminAccount {
  id: string
  email: string
  role: "ADMIN" | "SUPERADMIN"
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
