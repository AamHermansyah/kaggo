"use client"

import { useState } from "react"
import Link from "next/link"
import { CalendarClock, Check } from "lucide-react"

import { FormAlert } from "@/components/shared/form/form-alert"
import { SelectField } from "@/components/shared/form/select-field"
import { SubmitButton } from "@/components/shared/form/submit-button"
import { TextField } from "@/components/shared/form/text-field"
import { Button } from "@/components/ui/button"
import { FieldGroup } from "@/components/ui/field"
import { useActionForm } from "@/hooks/use-action-form"
import type { BatchRequestResult } from "@/lib/api/types"
import { formatDateTime } from "@/lib/format"
import { CITY_OPTIONS } from "@/lib/geo/cities"
import { ROUTES } from "@/lib/routes"
import { batchRequestSchema } from "@/lib/validation/schemas/rider"
import { submitBatchRequestAction } from "./actions"

/**
 * Drop a package off with a logistics company.
 *
 * The mock-up asked the user to pick a batch from a dropdown; the v1.1 API
 * matches on server time instead — whichever batch on the route has an open
 * drop-off window right now — so no batch picker is shown. The matched batch
 * number comes back in the response and is displayed on success.
 *
 * Departure ("From") and arrival ("To") are free-text fields as expected
 * by users and the backend API.
 *
 * There is no receiver field: the backend records the requester as both sender
 * and receiver, making this a drop-off-and-track flow rather than a
 * send-to-someone-else one.
 */
export function BatchForm({ modeSwitch }: { modeSwitch: React.ReactNode }) {
  const [matched, setMatched] = useState<BatchRequestResult | null>(null)

  const { form, onSubmit, pending, formError } = useActionForm({
    schema: batchRequestSchema,
    defaultValues: {
      companyCode: "",
      from: "",
      to: "",
      itemName: "",
    },
    action: submitBatchRequestAction,
    onSuccess: (result) => setMatched(result),
  })

  if (matched) return <BatchMatched result={matched} />

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-1 flex-col">
      <FieldGroup className="mb-5 shrink-0 gap-3">
        <TextField
          control={form.control}
          name="companyCode"
          label="Company code"
          hideLabel
          inputMode="numeric"
          maxLength={6}
          autoComplete="off"
          placeholder="Company code"
          description="The 6-digit code the transport company gives you."
        />

        <TextField
          control={form.control}
          name="itemName"
          label="What are you sending?"
          hideLabel
          placeholder="What are you sending?"
          maxLength={200}
        />

        <SelectField
          control={form.control}
          name="from"
          label="From"
          hideLabel
          placeholder="Select departure city"
          options={CITY_OPTIONS}
        />

        <SelectField
          control={form.control}
          name="to"
          label="To"
          hideLabel
          placeholder="Select destination city"
          options={CITY_OPTIONS}
        />
      </FieldGroup>

      <div className="mb-6 flex shrink-0 items-center justify-center rounded-[14px] bg-secondary px-6 py-4 text-center">
        <p className="text-[13.5px] leading-relaxed text-foreground/75">
          You will be notified to complete payment once your package is assigned
          to a driver.
        </p>
      </div>

      {modeSwitch}

      <FormAlert message={formError} className="mb-4 shrink-0" />

      <div className="flex-1" />

      <SubmitButton
        pending={pending}
        pendingLabel="Finding a batch"
        className="mt-auto"
      >
        Join a batch
      </SubmitButton>
    </form>
  )
}

function BatchMatched({ result }: { result: BatchRequestResult }) {
  return (
    <div className="flex flex-1 flex-col items-center gap-6 pt-6 text-center">
      <div className="flex size-18 items-center justify-center rounded-full bg-primary">
        <Check className="size-10 stroke-[2.5] text-primary-foreground" />
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-[22px] font-bold tracking-tight text-foreground">
          You&rsquo;re on batch {result.matchedBatchNumber}
        </h2>
        <p className="max-w-70 text-[14px] leading-relaxed text-foreground/70">
          {result.itemName} is queued for drop-off. We will let you know when a
          driver is assigned and payment is due.
        </p>
      </div>

      {result.scheduledDeparture ? (
        <p className="flex items-center gap-2 rounded-[14px] bg-secondary px-4 py-3 text-[13px] text-foreground/75">
          <CalendarClock className="size-4 shrink-0" />
          Departs {formatDateTime(result.scheduledDeparture)}
        </p>
      ) : null}

      <div className="mt-auto flex w-full shrink-0 flex-col gap-3">
        <Button
          render={<Link href={ROUTES.track} />}
          nativeButton={false}
          size="lg"
          className="h-13 w-full rounded-full text-[15px] font-semibold"
        >
          Track this package
        </Button>
      </div>
    </div>
  )
}
