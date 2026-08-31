/**
 * Presentation helpers.
 *
 * All of them accept the loose shapes the API actually returns (nullable
 * timestamps, missing currencies) and degrade to a dash rather than throwing
 * inside a render.
 */

const DASH = "—"

export function formatCurrency(
  amount: number | null | undefined,
  currency = "NGN"
): string {
  if (typeof amount !== "number" || !Number.isFinite(amount)) return DASH
  try {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency,
      maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
    }).format(amount)
  } catch {
    return `${currency} ${amount.toLocaleString("en-NG")}`
  }
}

export function formatNumber(value: number | null | undefined): string {
  if (typeof value !== "number" || !Number.isFinite(value)) return DASH
  return value.toLocaleString("en-NG")
}

/** `23_400_000` → `23.4M`, for the dashboard tiles. */
export function formatCompact(value: number | null | undefined): string {
  if (typeof value !== "number" || !Number.isFinite(value)) return DASH
  return new Intl.NumberFormat("en-NG", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value)
}

function toDate(value: string | null | undefined): Date | null {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

/** `6:45 P.M` — matches the format used across the designs. */
export function formatTime(value: string | null | undefined): string {
  const date = toDate(value)
  if (!date) return DASH
  return date
    .toLocaleTimeString("en-NG", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .replace(/\s?(AM|PM)$/i, (_, meridiem: string) =>
      ` ${meridiem.toUpperCase()[0]}.M`
    )
}

/** `Today, 6:45 P.M` / `12 Aug, 6:45 P.M`. */
export function formatDateTime(value: string | null | undefined): string {
  const date = toDate(value)
  if (!date) return DASH

  const now = new Date()
  const sameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()

  const day = sameDay
    ? "Today"
    : date.toLocaleDateString("en-NG", { day: "numeric", month: "short" })

  return `${day}, ${formatTime(value)}`
}

export function formatDate(value: string | null | undefined): string {
  const date = toDate(value)
  if (!date) return DASH
  return date.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

/** `23_400` seconds → `6 hrs 30 mins`. */
export function formatDuration(seconds: number | null | undefined): string {
  if (typeof seconds !== "number" || !Number.isFinite(seconds) || seconds <= 0) {
    return "0 mins"
  }

  const totalMinutes = Math.round(seconds / 60)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  if (hours === 0) return `${minutes} min${minutes === 1 ? "" : "s"}`
  if (minutes === 0) return `${hours} hr${hours === 1 ? "" : "s"}`
  return `${hours} hr${hours === 1 ? "" : "s"} ${minutes} min${minutes === 1 ? "" : "s"}`
}

/**
 * The backend reports position as raw coordinates — there is no geocoder in
 * scope — so the UI shows the coordinates rather than inventing a place name.
 */
export function formatCoordinates(
  position: { lat: number; lng: number } | null | undefined
): string | null {
  if (!position) return null
  const { lat, lng } = position
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null
  return `${lat.toFixed(3)}, ${lng.toFixed(3)}`
}

export function formatBattery(level: number | null | undefined): string | null {
  if (typeof level !== "number" || !Number.isFinite(level)) return null
  return `${Math.round(level)}%`
}

/** `Toyota, Hiace, White` → `Toyota Hiace, White`. */
export function describeVehicle(vehicle: {
  make?: string | null
  model?: string | null
  colour?: string | null
}): string {
  const name = [vehicle.make, vehicle.model].filter(Boolean).join(" ").trim()
  const parts = [name, vehicle.colour].filter(Boolean)
  return parts.length > 0 ? parts.join(", ") : DASH
}

export { DASH }
