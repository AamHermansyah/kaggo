"use client"

import { useState, useTransition } from "react"
import { Search } from "lucide-react"

import { FormAlert } from "@/components/shared/form/form-alert"
import { SubmitButton } from "@/components/shared/form/submit-button"
import { TextField } from "@/components/shared/form/text-field"
import { VehicleCard } from "@/components/shared/vehicle-card"
import { Button } from "@/components/ui/button"
import { FieldGroup } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { useActionForm } from "@/hooks/use-action-form"
import type { VehicleLookup } from "@/lib/api/types"
import { assignDriverSchema } from "@/lib/validation/schemas/fleet"
import { lookupVehicleAction } from "@/app/send-item/actions"
import { assignDriverAction } from "../actions"

/**
 * Driver assignment.
 *
 * The vehicle preview reuses the rider-facing `GET /vehicles/lookup`, which is
 * public — that is a real endpoint, so the card shows the actual vehicle rather
 * than the hard-coded "KJA 255 GA" from the mock-up.
 */
export function AssignDriverForm({ batchId }: { batchId: string }) {
  const [vehicle, setVehicle] = useState<VehicleLookup | null>(null)
  const [lookupError, setLookupError] = useState<string | null>(null)
  const [lookingUp, startLookup] = useTransition()

  const { form, onSubmit, pending, formError } = useActionForm({
    schema: assignDriverSchema,
    defaultValues: { batchId, vehicleRef: "" },
    action: assignDriverAction,
  })

  const vehicleRef = form.watch("vehicleRef")

  function runLookup() {
    const reference = (vehicleRef ?? "").trim()
    if (reference.length < 3) {
      form.setError("vehicleRef", {
        type: "manual",
        message: "Enter the vehicle plate number or the driver's phone number",
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
      <p className="mb-6 shrink-0 text-[13.5px] leading-relaxed text-foreground/75">
        This driver will be assigned to all packages in this batch. The
        driver&rsquo;s GPS device will be activated and journey tracking will
        begin according to Kaggo&rsquo;s journey rules.
      </p>

      <input type="hidden" {...form.register("batchId")} />

      <FieldGroup className="mb-6 shrink-0">
        <div className="flex items-start gap-2">
          <div className="flex-1">
            <TextField
              control={form.control}
              name="vehicleRef"
              label="Vehicle ID or driver's phone number"
              hideLabel
              autoComplete="off"
              placeholder="Vehicle ID/Driver’s phone number"
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
      </FieldGroup>

      {lookupError ? (
        <FormAlert message={lookupError} className="mb-4 shrink-0" />
      ) : null}

      {vehicle ? <VehicleCard vehicle={vehicle} className="mb-6" /> : null}

      <FormAlert message={formError} className="mb-4 shrink-0" />

      <div className="flex-1" />

      <SubmitButton
        pending={pending}
        pendingLabel="Assigning"
        disabled={!vehicle}
        className="mt-auto"
      >
        Assign Driver
      </SubmitButton>
    </form>
  )
}
