"use client"

import { FormAlert } from "@/components/shared/form/form-alert"
import { SubmitButton } from "@/components/shared/form/submit-button"
import { TextField } from "@/components/shared/form/text-field"
import { FieldGroup } from "@/components/ui/field"
import { useActionForm } from "@/hooks/use-action-form"
import { adminLoginSchema } from "@/lib/validation/schemas/auth"
import { adminLoginAction } from "../actions"

export function AdminLoginForm({ nextPath }: { nextPath?: string }) {
  const { form, onSubmit, pending, formError } = useActionForm({
    schema: adminLoginSchema,
    defaultValues: { email: "", password: "" },
    action: (values) => adminLoginAction(values, nextPath),
  })

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-1 flex-col">
      <FieldGroup className="mb-6 shrink-0 gap-4">
        <TextField
          control={form.control}
          name="email"
          label="Email"
          type="email"
          inputMode="email"
          autoComplete="username"
          autoFocus
          placeholder="you@kaggo.app"
        />
        <TextField
          control={form.control}
          name="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
        />
      </FieldGroup>

      <FormAlert message={formError} className="mb-4 shrink-0" />

      <div className="flex-1" />

      <SubmitButton pending={pending} pendingLabel="Signing in" className="mt-auto">
        Sign in
      </SubmitButton>
    </form>
  )
}
