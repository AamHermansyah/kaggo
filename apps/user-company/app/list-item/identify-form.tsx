"use client"

import { useState } from "react"

import { FormAlert } from "@/components/shared/form/form-alert"
import { SubmitButton } from "@/components/shared/form/submit-button"
import { TextField } from "@/components/shared/form/text-field"
import { FieldGroup } from "@/components/ui/field"
import { Separator } from "@/components/ui/separator"
import { useActionForm } from "@/hooks/use-action-form"
import { identifySchema } from "@/lib/validation/schemas/rider"
import { identifyAction } from "./actions"

/**
 * Single identify screen.
 *
 * The design had two near-identical pages ("first time" and "new device"). The
 * backend treats them as one call — the second field is only ever needed after
 * a 409 — so they are merged here and the extra input is revealed on demand.
 */
export function IdentifyForm({
  nextPath,
  startOnNewDevice = false,
}: {
  nextPath?: string
  startOnNewDevice?: boolean
}) {
  const [needsCounterparty, setNeedsCounterparty] = useState(startOnNewDevice)

  const { form, onSubmit, pending, formError } = useActionForm({
    schema: identifySchema,
    defaultValues: { phoneNumber: "", lastCounterpartyPhone: "" },
    action: (values) => identifyAction(values, nextPath),
    onError: () => setNeedsCounterparty(true),
  })

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="flex flex-1 flex-col"
      aria-labelledby="identify-heading"
    >
      <h1
        id="identify-heading"
        className="mb-8 shrink-0 text-xl font-medium text-foreground"
      >
        {needsCounterparty
          ? "Using MyKaggo on a new device?"
          : "Using MyKaggo for the first time?"}
      </h1>

      <FieldGroup className="mb-4 shrink-0 gap-4">
        <TextField
          control={form.control}
          name="phoneNumber"
          label="Your phone number"
          hideLabel
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          autoFocus
          placeholder="Enter your phone number"
        />

        {needsCounterparty ? (
          <TextField
            control={form.control}
            name="lastCounterpartyPhone"
            label="Last sender or receiver's phone number"
            hideLabel
            type="tel"
            inputMode="tel"
            placeholder="Enter last sender/receiver's number"
            description="We use this to confirm it is really you on this device."
          />
        ) : null}
      </FieldGroup>

      <FormAlert message={formError} className="mb-4 shrink-0" />

      <div className="flex-1" />

      <div className="mt-auto flex w-full shrink-0 flex-col items-center">
        <button
          type="button"
          onClick={() => setNeedsCounterparty((previous) => !previous)}
          className="mb-6 text-[15px] font-medium text-primary transition-opacity hover:underline active:opacity-70"
        >
          {needsCounterparty
            ? "Set up MyKaggo for the first time"
            : "Set up MyKaggo on a new device"}
        </button>

        <Separator className="-mx-6 mb-6 w-[calc(100%+3rem)]" />

        <SubmitButton pending={pending} pendingLabel="Checking">
          Continue
        </SubmitButton>
      </div>
    </form>
  )
}
