"use client"

import {
  useController,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

export interface TextareaFieldProps<
  TValues extends FieldValues,
  TName extends FieldPath<TValues>,
> extends Omit<
    React.ComponentProps<typeof Textarea>,
    "name" | "defaultValue" | "value"
  > {
  control: Control<TValues>
  name: TName
  label: string
  description?: React.ReactNode
  hideLabel?: boolean
}

/** Multi-line counterpart of `TextField`, wired the same way. */
export function TextareaField<
  TValues extends FieldValues,
  TName extends FieldPath<TValues>,
>({
  control,
  name,
  label,
  description,
  hideLabel,
  className,
  ...textareaProps
}: TextareaFieldProps<TValues, TName>) {
  const { field, fieldState } = useController({ control, name })
  const invalid = Boolean(fieldState.error)
  const describedBy = description ? `${name}-description` : undefined

  return (
    <Field data-invalid={invalid || undefined}>
      <FieldLabel htmlFor={name} className={cn(hideLabel && "sr-only")}>
        {label}
      </FieldLabel>
      <Textarea
        id={name}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        className={cn("rounded-xl border-border/60 text-[14px]", className)}
        {...textareaProps}
        {...field}
        value={typeof field.value === "string" ? field.value : ""}
      />
      {description ? (
        <FieldDescription id={describedBy}>{description}</FieldDescription>
      ) : null}
      <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
    </Field>
  )
}
