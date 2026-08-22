import "server-only"

import { redirect } from "next/navigation"

import { safeLoad, type LoadResult } from "./safe-load"

/**
 * `safeLoad` with one extra rule: a 401 from the backend means the stored
 * identity is no longer valid, so the session is torn down instead of showing
 * a retry button that can never succeed.
 *
 * Cookies cannot be mutated during a render, so this hands off to a Route
 * Handler that clears the cookie and lands on the right sign-in screen.
 */
async function loadWithSessionGuard<T>(
  loader: () => Promise<T>,
  logoutPath: string
): Promise<LoadResult<T>> {
  const result = await safeLoad(loader)

  if (!result.ok && result.code === "UNAUTHORIZED") {
    redirect(`${logoutPath}?reason=expired`)
  }

  return result
}

export const loadAdmin = <T>(loader: () => Promise<T>) =>
  loadWithSessionGuard(loader, "/dashboard/logout")

export const loadCompany = <T>(loader: () => Promise<T>) =>
  loadWithSessionGuard(loader, "/company/logout")

/**
 * Riders have no token to expire, but the backend rejects an `x-user-id` it
 * does not recognise — a stale or tampered cookie. Same treatment: drop it and
 * send them back through identify.
 */
export const loadRider = <T>(loader: () => Promise<T>) =>
  loadWithSessionGuard(loader, "/logout")
