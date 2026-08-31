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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

export interface SelectOption {
  value: string
  label: string
  hint?: string
}

export interface SelectFieldProps<
  TValues extends FieldValues,
  TName extends FieldPath<TValues>,
> {
  control: Control<TValues>
  name: TName
  label: string
  options: readonly SelectOption[]
  placeholder?: string
  description?: string
  hideLabel?: boolean
  disabled?: boolean
  className?: string
}

/**
 * Select bound to react-hook-form.
 *
 * Base UI's Select is uncontrolled-by-value rather than by event, so the
 * controller's `onChange` is driven from `onValueChange` instead of a DOM
 * event. `SelectItem`s stay inside a `SelectGroup` per the shadcn composition
 * rules.
 */
export function SelectField<
  TValues extends FieldValues,
  TName extends FieldPath<TValues>,
>({
  control,
  name,
  label,
  options,
  placeholder = "Select an option",
  description,
  hideLabel,
  disabled,
  className,
}: SelectFieldProps<TValues, TName>) {
  const { field, fieldState } = useController({ control, name })
  const invalid = Boolean(fieldState.error)
  const describedBy = description ? `${name}-description` : undefined

  return (
    <Field data-invalid={invalid || undefined}>
      <FieldLabel htmlFor={name} className={cn(hideLabel && "sr-only")}>
        {label}
      </FieldLabel>
      <Select
        value={(field.value as string | undefined) ?? ""}
        onValueChange={(value) => field.onChange(value)}
        disabled={disabled ?? field.disabled}
      >
        <SelectTrigger
          id={name}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          onBlur={field.onBlur}
          className={cn(
            "h-13 w-full rounded-xl border-border/60 px-4 text-[15px] shadow-none",
            className
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="rounded-xl">
          <SelectGroup>
            {options.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="py-2.5 text-[15px]"
              >
                {option.label}
                {option.hint ? (
                  <span className="text-muted-foreground">{option.hint}</span>
                ) : null}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {description ? (
        <FieldDescription id={describedBy}>{description}</FieldDescription>
      ) : null}
      <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
    </Field>
  )
}
