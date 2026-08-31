import type { RangeFilter } from "@/lib/api/types"
import { rangeSchema } from "@/lib/validation/schemas/settings"

export interface AdminListParams {
  range: RangeFilter
  query: string
  cursor?: string
}

type RawParams = Record<string, string | string[] | undefined>

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value
}

/**
 * Normalises the admin list query string.
 *
 * `range` falls back to "all" for anything unrecognised (`rangeSchema` uses
 * `.catch`), and `cursor` is length-capped so a hand-edited URL cannot push an
 * unbounded string into an upstream query parameter.
 */
export function parseAdminParams(params: RawParams): AdminListParams {
  const cursor = first(params.cursor)?.trim()

  return {
    range: rangeSchema.parse(first(params.range)),
    query: (first(params.q) ?? "").trim().slice(0, 100),
    cursor: cursor && cursor.length <= 300 ? cursor : undefined,
  }
}

/** Case-insensitive "does any of these fields contain the query" match. */
export function matchesQuery(
  query: string,
  ...fields: Array<string | number | null | undefined>
): boolean {
  if (!query) return true
  const needle = query.toLowerCase()
  return fields.some((field) =>
    String(field ?? "")
      .toLowerCase()
      .includes(needle)
  )
}
