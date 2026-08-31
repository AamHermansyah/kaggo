import "server-only"

import { redirect } from "next/navigation"

import { ROUTES } from "@/lib/routes"
import { safeLoad, type LoadResult } from "./safe-load"

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
  loadWithSessionGuard(loader, ROUTES.adminLogout)
