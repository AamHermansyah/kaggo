"use client"

import { FormAlert } from "@/components/shared/form/form-alert"
import { PasswordField } from "@/components/shared/form/password-field"
import { SubmitButton } from "@/components/shared/form/submit-button"
import { TextField } from "@/components/shared/form/text-field"
import { FieldGroup } from "@/components/ui/field"
import { useActionForm } from "@/hooks/use-action-form"
import { companyRegisterSchema } from "@/lib/validation/schemas/auth"
import { companyRegisterAction } from "../actions"

export function CompanyRegisterForm() {
  const { form, onSubmit, pending, formError } = useActionForm({
    schema: companyRegisterSchema,
    defaultValues: {
      name: "",
      address: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
    action: companyRegisterAction,
  })

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-1 flex-col">
      <FieldGroup className="mb-6 shrink-0 gap-3.5">
        <TextField
          control={form.control}
          name="name"
          label="Company name"
          hideLabel
          autoComplete="organization"
          placeholder="Company Name"
        />
        <TextField
          control={form.control}
          name="address"
          label="Company address"
          hideLabel
          autoComplete="street-address"
          placeholder="Company Address"
        />
        <TextField
          control={form.control}
          name="email"
          label="Company email"
          hideLabel
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="Company Email"
        />
        <TextField
          control={form.control}
          name="phone"
          label="Phone number"
          hideLabel
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="Phone Number"
        />
        <PasswordField
          control={form.control}
          name="password"
          label="Create password"
          hideLabel
          showStrength
          autoComplete="new-password"
          placeholder="Create Password"
        />
        <PasswordField
          control={form.control}
          name="confirmPassword"
          label="Confirm password"
          hideLabel
          autoComplete="new-password"
          placeholder="Confirm Password"
        />
      </FieldGroup>

      <FormAlert message={formError} className="mb-4 shrink-0" />

      <div className="flex-1" />

      <SubmitButton
        pending={pending}
        pendingLabel="Creating account"
        className="mt-auto"
      >
        Create Company Account
      </SubmitButton>
    </form>
  )
}
