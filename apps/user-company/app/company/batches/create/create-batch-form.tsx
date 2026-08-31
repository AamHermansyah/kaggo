"use client"

import { FormAlert } from "@/components/shared/form/form-alert"
import { SelectField } from "@/components/shared/form/select-field"
import { SubmitButton } from "@/components/shared/form/submit-button"
import { TextField } from "@/components/shared/form/text-field"
import { FieldGroup } from "@/components/ui/field"
import { useActionForm } from "@/hooks/use-action-form"
import { CITY_OPTIONS } from "@/lib/geo/cities"
import { createBatchSchema } from "@/lib/validation/schemas/fleet"
import { createBatchAction } from "../actions"

export function CreateBatchForm() {
  const { form, onSubmit, pending, formError } = useActionForm({
    schema: createBatchSchema,
    defaultValues: {
      departure: "",
      destination: "",
      dropOffStartTime: "",
      dropOffCloseTime: "",
      batchNumber: "",
    },
    action: createBatchAction,
  })

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-1 flex-col">
      <FieldGroup className="mb-6 shrink-0 gap-3.5">
        <SelectField
          control={form.control}
          name="departure"
          label="Departure"
          hideLabel
          placeholder="Select departure city"
          options={CITY_OPTIONS}
        />
        <SelectField
          control={form.control}
          name="destination"
          label="Destination"
          hideLabel
          placeholder="Select destination city"
          options={CITY_OPTIONS}
        />
        <TextField
          control={form.control}
          name="dropOffStartTime"
          label="Drop off starting time"
          type="time"
          placeholder="Drop off starting time"
        />
        <TextField
          control={form.control}
          name="dropOffCloseTime"
          label="Drop off closing time"
          type="time"
          placeholder="Drop off closing time"
        />
        <TextField
          control={form.control}
          name="batchNumber"
          label="Batch number"
          hideLabel
          placeholder="Batch number"
        />
      </FieldGroup>

      <FormAlert message={formError} className="mb-4 shrink-0" />

      <div className="flex-1" />

      <SubmitButton pending={pending} pendingLabel="Creating" className="mt-auto">
        Create Batch
      </SubmitButton>
    </form>
  )
}
