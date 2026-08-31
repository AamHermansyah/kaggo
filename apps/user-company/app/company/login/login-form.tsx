"use client"

import Link from "next/link"

import { FormAlert } from "@/components/shared/form/form-alert"
import { PasswordField } from "@/components/shared/form/password-field"
import { SubmitButton } from "@/components/shared/form/submit-button"
import { TextField } from "@/components/shared/form/text-field"
import { FieldGroup } from "@/components/ui/field"
import { useActionForm } from "@/hooks/use-action-form"
import { ROUTES } from "@/lib/routes"
import { companyLoginSchema } from "@/lib/validation/schemas/auth"
import { companyLoginAction } from "../actions"

export function CompanyLoginForm({ nextPath }: { nextPath?: string }) {
  const { form, onSubmit, pending, formError } = useActionForm({
    schema: companyLoginSchema,
    defaultValues: { email: "", password: "" },
    action: (values) => companyLoginAction(values, nextPath),
  })

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-1 flex-col">
      <FieldGroup className="mb-6 shrink-0 gap-4">
        <TextField
          control={form.control}
          name="email"
          label="Email"
          hideLabel
          type="email"
          inputMode="email"
          autoComplete="username"
          autoFocus
          placeholder="Email"
        />
        <PasswordField
          control={form.control}
          name="password"
          label="Password"
          hideLabel
          autoComplete="current-password"
          placeholder="Password"
        />
      </FieldGroup>

      <FormAlert message={formError} className="mb-4 shrink-0" />

      <div className="mb-6 flex shrink-0 justify-center text-[13.5px]">
        <span className="mr-1.5 text-foreground/70">
          Don&rsquo;t have an account?
        </span>
        <Link
          href={ROUTES.companyRegister}
          className="font-semibold text-primary hover:underline"
        >
          Create Account
        </Link>
      </div>

      <div className="flex-1" />

      <SubmitButton pending={pending} pendingLabel="Signing in" className="mt-auto">
        Login
      </SubmitButton>
    </form>
  )
}
