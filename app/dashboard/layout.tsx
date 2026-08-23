import type { Metadata } from "next"

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · MyKaggo Admin" },
  robots: { index: false, follow: false },
}

/**
 * Container only.
 *
 * The auth check is deliberately *not* here: `/dashboard/login` is a child of
 * this layout, and guarding at this level would bounce the login screen to
 * itself. Each page calls `requireAdminToken()` instead — the guard sits next
 * to the data it protects, which is also what stops a new page from silently
 * inheriting an unprotected layout.
 *
 * The search bar and section tiles moved into `AdminShell`, because layouts
 * cannot read `searchParams` and both are driven by them.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex flex-1 flex-col overflow-x-hidden overflow-y-auto px-5 pt-2 pb-6">
      {children}
    </div>
  )
}
