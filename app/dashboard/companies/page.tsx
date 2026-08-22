import { redirect } from "next/navigation"

import { ROUTES } from "@/lib/routes"

/**
 * The design had a "Companies" tab with approve / reject / suspend actions, but
 * the admin API exposes no company resource at all — nothing backs those
 * buttons. Revenue took its place in the tile row; this route redirects so the
 * old link is not a dead end.
 */
export default function CompaniesRedirect() {
  redirect(ROUTES.adminRevenue)
}
