"use client"

import { useState, useTransition } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import type { AdminCompany, CompanyStatus } from "@/lib/api/types"
import { formatDate, formatNumber } from "@/lib/format"
import { formatPhone } from "@/lib/validation/phone"
import { cn } from "@/lib/utils"
import {
  approveCompanyAction,
  deleteCompanyAction,
  reactivateCompanyAction,
  rejectCompanyAction,
  suspendCompanyAction,
} from "./actions"

const STATUS_STYLE: Record<
  CompanyStatus,
  { label: string; variant: "default" | "secondary" | "destructive" }
> = {
  PENDING: { label: "Pending", variant: "secondary" },
  APPROVED: { label: "Approved", variant: "default" },
  REJECTED: { label: "Rejected", variant: "destructive" },
  SUSPENDED: { label: "Suspended", variant: "destructive" },
}

/** Which actions the backend will accept for a given status. */
function availableActions(status: CompanyStatus) {
  return {
    approve: status === "PENDING",
    reject: status === "PENDING",
    suspend: status === "APPROVED",
    reactivate: status === "SUSPENDED" || status === "REJECTED",
  }
}

type PendingReason = "reject" | "suspend" | "delete" | null

/**
 * One company row with its lifecycle controls, matching the expandable design.
 *
 * SUPERADMIN-only actions are hidden for a plain ADMIN. That is presentation:
 * the backend answers 401 for them regardless, so hiding is about not offering
 * a button that cannot work.
 */
export function CompanyCard({
  company,
  canManage,
}: {
  company: AdminCompany
  /** True for SUPERADMIN — suspend, reactivate and delete are gated on it. */
  canManage: boolean
}) {
  const [expanded, setExpanded] = useState(false)
  const [reasonFor, setReasonFor] = useState<PendingReason>(null)
  const [reason, setReason] = useState("")
  const [pending, startTransition] = useTransition()

  const status = STATUS_STYLE[company.status]
  const actions = availableActions(company.status)

  function run(
    label: string,
    work: () => Promise<{ ok: boolean; message?: string }>
  ) {
    startTransition(async () => {
      const result = await work()
      if (result.ok) {
        toast.success(`${company.name} ${label}.`)
        setReasonFor(null)
        setReason("")
      } else {
        toast.error(result.message ?? "That did not work.")
      }
    })
  }

  function submitReason() {
    if (!reasonFor) return
    const payload = { companyId: company.companyId, reason }

    if (reasonFor === "reject") {
      run("rejected", () => rejectCompanyAction(payload))
    } else if (reasonFor === "suspend") {
      run("suspended", () => suspendCompanyAction(payload))
    } else {
      run("deleted", () => deleteCompanyAction(payload))
    }
  }

  return (
    <div className="flex flex-col border-b border-border/40 pb-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1.5">
          <span className="text-[15px] leading-tight font-medium text-foreground">
            {company.name}
          </span>
          <span className="text-[14px] leading-tight text-foreground/80">
            {formatPhone(company.phone)}
          </span>
          <span className="text-[13px] leading-tight text-foreground/70">
            {formatNumber(company.vehicleCount)} vehicles ·{" "}
            {formatNumber(company.completedShipments)} completed
          </span>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <Badge variant={status.variant}>{status.label}</Badge>
          <span className="font-mono text-[13px] text-foreground/80">
            {company.companyCode}
          </span>
          <button
            type="button"
            onClick={() => setExpanded((open) => !open)}
            aria-expanded={expanded}
            aria-label={
              expanded ? "Hide company actions" : "Show company actions"
            }
            className="mt-0.5 flex size-5 items-center justify-center rounded-full border border-primary text-primary transition-colors hover:bg-primary/10"
          >
            {expanded ? (
              <ChevronUp className="size-3.5 stroke-[2.5]" />
            ) : (
              <ChevronDown className="size-3.5 stroke-[2.5]" />
            )}
          </button>
        </div>
      </div>

      {expanded ? (
        <div className="mt-3 flex flex-col gap-3 rounded-xl border border-primary/20 bg-secondary px-4 py-3.5">
          <dl className="flex flex-col gap-1 text-[13px] text-foreground/70">
            <div className="flex justify-between gap-3">
              <dt>Email</dt>
              <dd className="truncate text-foreground/90">{company.email}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt>Registered</dt>
              <dd className="text-foreground/90">
                {formatDate(company.createdAt)}
              </dd>
            </div>
            {company.rejectionReason ? (
              <div className="flex justify-between gap-3">
                <dt>Rejected because</dt>
                <dd className="text-end text-foreground/90">
                  {company.rejectionReason}
                </dd>
              </div>
            ) : null}
            {company.suspensionReason ? (
              <div className="flex justify-between gap-3">
                <dt>Suspended because</dt>
                <dd className="text-end text-foreground/90">
                  {company.suspensionReason}
                </dd>
              </div>
            ) : null}
          </dl>

          {reasonFor ? (
            <div className="flex flex-col gap-2">
              <label
                htmlFor={`reason-${company.companyId}`}
                className="text-[13px] font-medium text-foreground"
              >
                Reason for {reasonFor}
                {reasonFor === "delete" ? " (permanent)" : ""}
              </label>
              <Input
                id={`reason-${company.companyId}`}
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                maxLength={500}
                autoFocus
                placeholder="Explain why — the company sees this"
                className="h-11 rounded-lg text-[14px]"
              />
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant={reasonFor === "delete" ? "destructive" : "default"}
                  disabled={pending || reason.trim().length === 0}
                  onClick={submitReason}
                >
                  {pending ? <Spinner data-icon="inline-start" /> : null}
                  Confirm {reasonFor}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={pending}
                  onClick={() => {
                    setReasonFor(null)
                    setReason("")
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className={cn("flex flex-wrap items-center gap-3")}>
              {actions.approve ? (
                <ActionButton
                  pending={pending}
                  onClick={() =>
                    run("approved", () =>
                      approveCompanyAction(company.companyId)
                    )
                  }
                >
                  Approve
                </ActionButton>
              ) : null}

              {actions.reject ? (
                <ActionButton pending={pending} onClick={() => setReasonFor("reject")}>
                  Reject
                </ActionButton>
              ) : null}

              {canManage && actions.suspend ? (
                <ActionButton
                  pending={pending}
                  onClick={() => setReasonFor("suspend")}
                >
                  Suspend
                </ActionButton>
              ) : null}

              {canManage && actions.reactivate ? (
                <ActionButton
                  pending={pending}
                  onClick={() =>
                    run("reactivated", () =>
                      reactivateCompanyAction(company.companyId)
                    )
                  }
                >
                  Reactivate
                </ActionButton>
              ) : null}

              {canManage ? (
                <ActionButton
                  pending={pending}
                  destructive
                  onClick={() => setReasonFor("delete")}
                >
                  Delete
                </ActionButton>
              ) : null}

              {!canManage ? (
                <p className="text-[12px] text-muted-foreground">
                  Suspend, reactivate and delete need a SUPERADMIN account.
                </p>
              ) : null}
            </div>
          )}
        </div>
      ) : null}
    </div>
  )
}

function ActionButton({
  children,
  onClick,
  pending,
  destructive,
}: {
  children: React.ReactNode
  onClick: () => void
  pending: boolean
  destructive?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      className={cn(
        "text-[14px] font-medium transition-opacity hover:underline active:opacity-70 disabled:opacity-40",
        destructive ? "text-destructive" : "text-primary"
      )}
    >
      {children}
    </button>
  )
}
