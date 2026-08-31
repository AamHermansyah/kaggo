"use client"

import { useCallback, useState, useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  useForm,
  type DefaultValues,
  type FieldValues,
  type Path,
  type UseFormReturn,
} from "react-hook-form"
import type { z } from "zod"

import type { ActionResult } from "@/lib/actions/result"

/**
 * `TInput` is what the inputs hold (always strings coming out of the DOM),
 * `TOutput` is what the schema produces after trimming/normalising. Both are
 * inferred from the schema, so call sites never spell them out.
 */
export interface UseActionFormOptions<
  TInput extends FieldValues,
  TOutput,
  Data,
> {
  schema: z.ZodType<TOutput, any, TInput>
  defaultValues: DefaultValues<TInput>

  /** Server Action. Receives values already parsed by the same schema. */
  action: (values: TOutput) => Promise<ActionResult<Data>>
  onSuccess?: (data: Data) => void | Promise<void>
  /** Called for failures that were not attributable to a specific field. */
  onError?: (message: string) => void
}

export interface UseActionFormReturn<TInput extends FieldValues, TOutput> {
  form: UseFormReturn<TInput, unknown, TOutput>
  onSubmit: (event?: React.BaseSyntheticEvent) => Promise<void>
  pending: boolean
  /** Form-level message, e.g. "Invalid email or password". */
  formError: string | null
  clearFormError: () => void
}

/**
 * Binds a Zod schema, react-hook-form and a Server Action together.
 *
 * The schema runs twice on purpose: in the browser for instant feedback, and
 * again inside the action, because a Server Action is a public endpoint and
 * cannot trust its caller. Field errors the server sends back are replayed onto
 * the matching inputs so server-only rules (a duplicate email, say) land on the
 * right control instead of in a toast.
 *
 * The action runs inside a transition, so `pending` also covers the router
 * work a successful `redirect()` triggers — the button stays disabled until the
 * new page commits.
 */
export function useActionForm<TInput extends FieldValues, TOutput, Data>({
  schema,
  defaultValues,
  action,
  onSuccess,
  onError,
}: UseActionFormOptions<TInput, TOutput, Data>): UseActionFormReturn<
  TInput,
  TOutput
> {
  const form = useForm<TInput, unknown, TOutput>({
    resolver: zodResolver(schema as never),
    defaultValues,
    mode: "onTouched",
  })

  const [pending, startTransition] = useTransition()
  const [formError, setFormError] = useState<string | null>(null)

  const clearFormError = useCallback(() => setFormError(null), [])

  const onSubmit = form.handleSubmit((values) => {
    setFormError(null)

    startTransition(async () => {
      const result = await action(values)

      if (result.ok) {
        await onSuccess?.(result.data)
        return
      }

      let attributed = false
      for (const [field, messages] of Object.entries(result.fieldErrors ?? {})) {
        if (!messages.length) continue
        if (!(field in form.getValues())) continue
        form.setError(field as Path<TInput>, {
          type: "server",
          message: messages.join(" "),
        })
        attributed = true
      }

      // Only surface a banner when no input could own the message.
      if (!attributed) {
        setFormError(result.message)
        onError?.(result.message)
      }
    })
  })

  return { form, onSubmit, pending, formError, clearFormError }
}
