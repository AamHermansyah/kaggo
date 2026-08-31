"use client"

import { FormAlert } from "@/components/shared/form/form-alert"
import { SubmitButton } from "@/components/shared/form/submit-button"
import { TextField } from "@/components/shared/form/text-field"
import { FieldGroup, FieldLegend, FieldSet } from "@/components/ui/field"
import { useActionForm } from "@/hooks/use-action-form"
import { vehicleOnboardingSchema } from "@/lib/validation/schemas/fleet"
import { onboardVehicleAction } from "./actions"

export function VehicleOnboardingForm() {
  const { form, onSubmit, pending, formError } = useActionForm({
    schema: vehicleOnboardingSchema,
    defaultValues: {
      driverFullName: "",
      driverPhone: "",
      companyName: "",
      plateNumber: "",
      make: "",
      model: "",
      colour: "",
      terminalNo: "",
    },
    action: onboardVehicleAction,
  })

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-1 flex-col">
      <FieldSet className="mb-6 shrink-0">
        <FieldLegend className="mb-3 text-[15px] font-semibold">
          Driver
        </FieldLegend>
        <FieldGroup className="gap-3">
          <TextField
            control={form.control}
            name="driverFullName"
            label="Driver's full name"
            hideLabel
            autoComplete="name"
            placeholder="Driver’s full name"
          />
          <TextField
            control={form.control}
            name="driverPhone"
            label="Driver's phone number"
            hideLabel
            type="tel"
            inputMode="tel"
            placeholder="Driver’s phone number"
          />
          <TextField
            control={form.control}
            name="companyName"
            label="Company / affiliation"
            hideLabel
            placeholder="Company/Affiliation"
          />
        </FieldGroup>
      </FieldSet>

      <FieldSet className="mb-6 shrink-0">
        <FieldLegend className="mb-3 text-[15px] font-semibold">
          Vehicle
        </FieldLegend>
        <FieldGroup className="gap-3">
          <TextField
            control={form.control}
            name="plateNumber"
            label="Number plate"
            hideLabel
            autoCapitalize="characters"
            placeholder="Number plate"
          />
          <TextField
            control={form.control}
            name="make"
            label="Vehicle make"
            hideLabel
            placeholder="Vehicle make (e.g. Toyota)"
          />
          <TextField
            control={form.control}
            name="model"
            label="Vehicle model"
            hideLabel
            placeholder="Vehicle model (e.g. Hiace)"
          />
          <TextField
            control={form.control}
            name="colour"
            label="Vehicle colour"
            hideLabel
            placeholder="Vehicle Colour"
          />
        </FieldGroup>
      </FieldSet>

      <FieldSet className="mb-6 shrink-0">
        <FieldLegend className="mb-3 text-[15px] font-semibold">
          MyKaggo device
        </FieldLegend>
        <FieldGroup className="gap-3">
          <TextField
            control={form.control}
            name="terminalNo"
            label="Terminal ID"
            hideLabel
            inputMode="numeric"
            placeholder="Terminal ID"
          />
        </FieldGroup>
      </FieldSet>

      <FormAlert message={formError} className="mb-4 shrink-0" />

      <div className="flex-1" />

      <SubmitButton
        pending={pending}
        pendingLabel="Assigning device"
        className="mt-auto"
      >
        Assign MyKaggo Device
      </SubmitButton>
    </form>
  )
}
