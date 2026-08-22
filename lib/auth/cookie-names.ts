/**
 * Cookie names only — no `server-only`, no `next/headers`.
 *
 * `proxy.ts` runs outside the React module graph and needs these, so they live
 * apart from the reader/writer helpers in `cookies.ts`.
 */
export const COOKIE = {
  rider: "kaggo_rider",
  admin: "kaggo_admin",
  company: "kaggo_company",
} as const

export type CookieName = (typeof COOKIE)[keyof typeof COOKIE]
