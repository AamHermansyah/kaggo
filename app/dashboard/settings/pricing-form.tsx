"use client"

import { useState } from "react"
import { toast } from "sonner"

import { FormAlert } from "@/components/shared/form/form-alert"
import { SubmitButton } from "@/components/shared/form/submit-button"
import { TextField } from "@/components/shared/form/text-field"
import { Badge } from "@/components/ui/badge"
import { useActionForm } from "@/hooks/use-action-form"
import type { CountrySetting } from "@/lib/api/types"
import { formatCurrency } from "@/lib/format"
import { countryPricingSchema } from "@/lib/validation/schemas/settings"
import { updateCountryPricingAction } from "./actions"

/**
 * Flat price per country.
 *
 * `code` is a hidden, schema-validated value rather than an editable input —
 * the operator edits the price, not which country row they are on.
 */
export function PricingForm({ country }: { country: CountrySetting }) {
  const [saved, setSaved] = useState<number | null>(null)

  const { form, onSubmit, pending, formError } = useActionForm({
    schema: countryPricingSchema,
    defaultValues: {
      code: country.code,
      flatPrice: String(country.flatPrice ?? ""),
    },
    action: updateCountryPricingAction,
    onSuccess: () => {
      const value = Number(form.getValues("flatPrice"))
      setSaved(Number.isFinite(value) ? value : null)
      toast.success(`${country.name} pricing updated`)
    },
  })

  const current = saved ?? country.flatPrice

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="flex flex-col gap-3 rounded-xl border border-border/60 p-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          <span className="text-[15px] font-semibold text-foreground">
            {country.name}{" "}
            <span className="font-mono text-[13px] text-foreground/50">
              {country.code}
            </span>
          </span>
          <span className="text-[13px] text-foreground/60">
            Current: {formatCurrency(current, country.currency)}
          </span>
        </div>
        <Badge variant={country.active ? "default" : "secondary"}>
          {country.active ? "Active" : "Inactive"}
        </Badge>
      </div>

      <input type="hidden" {...form.register("code")} />

      <TextField
        control={form.control}
        name="flatPrice"
        label={`Flat price (${country.currency})`}
        type="number"
        inputMode="decimal"
        min={1}
        step="any"
        className="h-11"
      />

      <FormAlert message={formError} />

      <SubmitButton
        pending={pending}
        pendingLabel="Saving"
        size="sm"
        className="h-10 self-end px-6 text-[14px]"
      >
        Save price
      </SubmitButton>
    </form>
  )
}
