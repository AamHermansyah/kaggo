import type { Metadata } from "next"
import { ShieldCheck } from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { safeInternalPath } from "@/lib/navigation"
import { ROUTES } from "@/lib/routes"
import { AdminLoginForm } from "./login-form"

export const metadata: Metadata = {
  title: "Admin sign in",
  description: "Sign in to the MyKaggo admin portal.",
  robots: { index: false, follow: false },
}

/**
 * The admin portal had no sign-in screen in the designs even though the API
 * requires email + password, so this one is added rather than leaving
 * `/dashboard` open. Accounts are provisioned by the backend team — the API
 * exposes no registration endpoint, so there is deliberately no "sign up" link.
 */
interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function AdminLoginPage({ searchParams }: Props) {

  const params = await searchParams
  const nextPath = safeInternalPath(
    typeof params.next === "string" ? params.next : undefined,
    ROUTES.adminHome
  )

  return (
    <div className="relative flex flex-1 flex-col overflow-x-hidden overflow-y-auto px-5 pt-8 pb-6">
      <div className="mb-8 flex shrink-0 flex-col gap-2">
        <div className="mb-2 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <ShieldCheck className="size-6 stroke-[1.5]" />
        </div>
        <h1 className="text-[22px] font-bold tracking-tight text-foreground">
          Admin portal
        </h1>
        <p className="text-[13.5px] leading-relaxed text-foreground/70">
          Sign in with your MyKaggo staff account to manage shipments, users,
          vehicles and pricing.
        </p>
      </div>

      {params.expired ? (
        <Alert className="mb-6 shrink-0">
          <AlertDescription>
            Your session expired. Please sign in again.
          </AlertDescription>
        </Alert>
      ) : null}

      <AdminLoginForm nextPath={nextPath} />
    </div>
  )
}
