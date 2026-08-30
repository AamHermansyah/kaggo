"use client"

import { useState, useTransition } from "react"
import { Search } from "lucide-react"

import { FormAlert } from "@/components/shared/form/form-alert"
import { SubmitButton } from "@/components/shared/form/submit-button"
import { TextField } from "@/components/shared/form/text-field"
import { VehicleCard } from "@/components/shared/vehicle-card"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Spinner } from "@/components/ui/spinner"
import { useActionForm } from "@/hooks/use-action-form"
import type { VehicleLookup } from "@/lib/api/types"
import { sendItemSchema } from "@/lib/validation/schemas/rider"
import { createShipmentAction, lookupVehicleAction } from "./actions"

/**
 * Direct-driver listing: the rider names the driver or plate themselves.
 * Departure ("From") and arrival ("To") are free-text fields as expected
 * by users and the backend API.
 *
 * The logistics-company alternative lives in `batch-form.tsx`.
 */
export function DriverForm({
  riderPhone,
  modeSwitch,
}: {
  riderPhone: string
  /** Rendered under the vehicle card, where the design puts the toggle. */
  modeSwitch: React.ReactNode
}) {
  const [vehicle, setVehicle] = useState<VehicleLookup | null>(null)
  const [lookupError, setLookupError] = useState<string | null>(null)
  const [lookingUp, startLookup] = useTransition()

  const { form, onSubmit, pending, formError } = useActionForm({
    schema: sendItemSchema,
    defaultValues: {
      role: "sender" as const,
      counterpartyPhone: "",
      itemName: "",
      from: "",
      to: "",
      vehicleRef: "",
    },
    action: createShipmentAction,
  })

  const role = form.watch("role")
  const vehicleRef = form.watch("vehicleRef")

  function runLookup() {
    const reference = (vehicleRef ?? "").trim()
    if (reference.length < 3) {
      form.setError("vehicleRef", {
        type: "manual",
        message: "Enter the driver's phone number or the vehicle plate number",
      })
      return
    }

    setLookupError(null)
    startLookup(async () => {
      const result = await lookupVehicleAction({ vehicleRef: reference })
      if (result.ok) {
        setVehicle(result.data)
        form.clearErrors("vehicleRef")
        return
      }
      setVehicle(null)
      setLookupError(result.message)
    })
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-1 flex-col">
      {/* Role ------------------------------------------------------------ */}
      <div className="mb-5 flex shrink-0 items-center justify-between gap-4">
        <span id="role-label" className="text-[14px] font-medium text-foreground">
          Select your role
        </span>
        <RadioGroup
          value={role}
          onValueChange={(value) =>
            form.setValue("role", value as "sender" | "receiver", {
              shouldDirty: true,
            })
          }
          aria-labelledby="role-label"
          className="flex items-center justify-end gap-4"
        >
          {(["sender", "receiver"] as const).map((option) => (
            <label
              key={option}
              className="flex cursor-pointer items-center gap-2 text-xs font-medium capitalize select-none"
            >
              <span
                className={
                  role === option ? "text-foreground" : "text-muted-foreground"
                }
              >
                {option}
              </span>
              <RadioGroupItem value={option} className="size-4" />
            </label>
          ))}
        </RadioGroup>
      </div>

      {/* Parcel ---------------------------------------------------------- */}
      <FieldGroup className="mb-5 shrink-0 gap-3">
        <TextField
          control={form.control}
          name="counterpartyPhone"
          label={
            role === "sender"
              ? "Receiver's phone number"
              : "Sender's phone number"
          }
          hideLabel
          type="tel"
          inputMode="tel"
          placeholder={
            role === "sender"
              ? "Receiver’s phone number"
              : "Sender’s phone number"
          }
        />

        <TextField
          control={form.control}
          name="itemName"
          label="What are you sending?"
          hideLabel
          placeholder="What are you sending?"
          maxLength={200}
        />

        <TextField
          control={form.control}
          name="from"
          label="From"
          hideLabel
          placeholder="From"
        />

        <TextField
          control={form.control}
          name="to"
          label="To"
          hideLabel
          placeholder="To"
        />

        {/* Vehicle lookup ------------------------------------------------ */}
        <Field>
          <FieldLabel htmlFor="vehicleRef" className="sr-only">
            Driver&rsquo;s phone number or vehicle ID
          </FieldLabel>
          <div className="flex items-start gap-2">
            <div className="flex-1">
              <TextField
                control={form.control}
                name="vehicleRef"
                label="Driver's phone number or vehicle ID"
                hideLabel
                placeholder="Driver&rsquo;s phone number/Vehicle ID"
                autoComplete="off"
                onBlur={() => {
                  if ((vehicleRef ?? "").trim().length >= 3 && !vehicle) {
                    runLookup()
                  }
                }}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={runLookup}
              disabled={lookingUp}
              aria-label="Look up vehicle"
              className="size-13 shrink-0 rounded-xl border-border/60 shadow-none"
            >
              {lookingUp ? <Spinner /> : <Search />}
            </Button>
          </div>
        </Field>
      </FieldGroup>

      {lookupError ? (
        <FormAlert message={lookupError} className="mb-4 shrink-0" />
      ) : null}

      {vehicle ? (
        <VehicleCard vehicle={vehicle} className="mb-6" />
      ) : (
        <p className="mb-6 shrink-0 rounded-[14px] bg-secondary px-6 py-4 text-center text-[13.5px] leading-relaxed text-foreground/70">
          Enter the driver&rsquo;s phone number or plate number, then tap search
          to confirm the vehicle before you pay.
        </p>
      )}

      {modeSwitch}

      <FormAlert message={formError} className="mb-4 shrink-0" />

      <div className="flex-1" />

      <SubmitButton
        pending={pending}
        pendingLabel="Creating listing"
        disabled={!vehicle}
        className="mt-auto"
      >
        Proceed to payment
      </SubmitButton>

      <p className="mt-3 shrink-0 text-center text-[12px] text-foreground/55">
        Listing as {role === "sender" ? "sender" : "receiver"} &middot;{" "}
        {riderPhone}
      </p>
    </form>
  )
}
