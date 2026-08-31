"use client"

import { useMemo } from "react"
import {
  useController,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { cn } from "@/lib/utils"

export interface ComboboxOption {
  value: string
  label: string
  /** Secondary text, e.g. the state a city sits in. */
  hint?: string
}

export interface ComboboxFieldProps<
  TValues extends FieldValues,
  TName extends FieldPath<TValues>,
> {
  control: Control<TValues>
  name: TName
  label: string
  options: readonly ComboboxOption[]
  placeholder?: string
  description?: string
  hideLabel?: boolean
  disabled?: boolean
  className?: string
  /**
   * How many matches to render at once. The location list runs to a thousand
   * entries, and painting all of them on an empty query is what makes a picker
   * feel slow on a mid-range phone.
   */
  limit?: number
  emptyMessage?: string
}

/**
 * Type-ahead picker for long option lists.
 *
 * Replaces the plain dropdown on the "From"/"To" fields: with a thousand
 * locations, scrolling a select is unusable — the list has to narrow as the
 * user types.
 *
 * Base UI filters `items` internally against the typed query, and matching is
 * on the label. The form still stores the option's `value`, so the id sent to
 * the API is unaffected by whatever the user typed.
 */
export function ComboboxField<
  TValues extends FieldValues,
  TName extends FieldPath<TValues>,
>({
  control,
  name,
  label,
  options,
  placeholder = "Search…",
  description,
  hideLabel,
  disabled,
  className,
  limit = 50,
  emptyMessage = "No location matches that search",
}: ComboboxFieldProps<TValues, TName>) {
  const { field, fieldState } = useController({ control, name })
  const invalid = Boolean(fieldState.error)
  const describedBy = description ? `${name}-description` : undefined

  // Base UI reads `{ value, label }` objects natively: `label` drives filtering
  // and the input display, `value` is what gets submitted.
  const items = useMemo(
    () =>
      options.map((option) => ({
        value: option.value,
        label: option.hint ? `${option.label} — ${option.hint}` : option.label,
      })),
    [options]
  )

  const selected = useMemo(
    () => items.find((item) => item.value === field.value) ?? null,
    [items, field.value]
  )

  return (
    <Field data-invalid={invalid || undefined}>
      <FieldLabel htmlFor={name} className={cn(hideLabel && "sr-only")}>
        {label}
      </FieldLabel>

      <Combobox
        items={items}
        value={selected}
        onValueChange={(next) => field.onChange(next?.value ?? "")}
        limit={limit}
        disabled={disabled ?? field.disabled}
      >
        <ComboboxInput
          id={name}
          placeholder={placeholder}
          showClear
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          onBlur={field.onBlur}
          className={cn(
            "h-13 rounded-xl border-border/60 px-4 text-[15px] shadow-none",
            className
          )}
        />
        <ComboboxContent className="rounded-xl">
          <ComboboxEmpty>{emptyMessage}</ComboboxEmpty>
          <ComboboxList>
            {(item: { value: string; label: string }) => (
              <ComboboxItem
                key={item.value}
                value={item}
                className="py-2.5 text-[15px]"
              >
                {item.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>

      {description ? (
        <FieldDescription id={describedBy}>{description}</FieldDescription>
      ) : null}
      <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
    </Field>
  )
}
