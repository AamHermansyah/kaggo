"use client"

import {
  useController,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"

import { Input } from "@/components/ui/input"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { cn } from "@/lib/utils"

export interface TextFieldProps<
  TValues extends FieldValues,
  TName extends FieldPath<TValues>,
> extends Omit<React.ComponentProps<typeof Input>, "name" | "defaultValue"> {
  control: Control<TValues>
  name: TName
  label: string
  description?: string
  /** Hide the visible label but keep it for screen readers. */
  hideLabel?: boolean
}

/**
 * Controlled text input wired to react-hook-form and the shadcn `Field`
 * primitives.
 *
 * Every form in the app funnels through this so validation state, ARIA wiring
 * and the rounded input styling from the designs stay identical everywhere.
 */
export function TextField<
  TValues extends FieldValues,
  TName extends FieldPath<TValues>,
>({
  control,
  name,
  label,
  description,
  hideLabel,
  className,
  ...inputProps
}: TextFieldProps<TValues, TName>) {
  const { field, fieldState } = useController({ control, name })
  const invalid = Boolean(fieldState.error)
  const describedBy = description ? `${name}-description` : undefined

  return (
    <Field data-invalid={invalid || undefined}>
      <FieldLabel htmlFor={name} className={cn(hideLabel && "sr-only")}>
        {label}
      </FieldLabel>
      <Input
        id={name}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        className={cn(
          "h-13 rounded-xl border-border/60 px-4 text-[15px] shadow-none",
          className
        )}
        {...inputProps}
        {...field}
        // A controlled input needs a defined value; react-hook-form starts
        // fields as `undefined` when a schema field is optional.
        value={typeof field.value === "string" ? field.value : ""}
      />
      {description ? (
        <FieldDescription id={describedBy}>{description}</FieldDescription>
      ) : null}
      <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
    </Field>
  )
}
