"use client"

import { useMemo, useState } from "react"
import {
  useController,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"
import { Eye, EyeOff } from "lucide-react"

import { Input } from "@/components/ui/input"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import {
  assessPassword,
  STRENGTH_LABEL,
  type PasswordStrength,
} from "@/lib/validation/password"
import { cn } from "@/lib/utils"

const METER: Record<PasswordStrength, { filled: number; bar: string; text: string }> =
  {
    weak: { filled: 1, bar: "bg-destructive", text: "text-destructive" },
    medium: { filled: 2, bar: "bg-amber-500", text: "text-amber-600" },
    strong: { filled: 3, bar: "bg-primary", text: "text-primary" },
  }

export interface PasswordFieldProps<
  TValues extends FieldValues,
  TName extends FieldPath<TValues>,
> extends Omit<
    React.ComponentProps<typeof Input>,
    "name" | "defaultValue" | "type"
  > {
  control: Control<TValues>
  name: TName
  label: string
  hideLabel?: boolean
  /** Show the weak/medium/strong meter. Off for sign-in fields. */
  showStrength?: boolean
}

/**
 * Password input with a reveal toggle and an optional strength meter.
 *
 * The meter is advisory UI only — the actual gate is the Zod schema, which
 * rejects anything scored "weak" and is re-run inside the Server Action. A
 * caller who bypasses the browser gets the same answer.
 */
export function PasswordField<
  TValues extends FieldValues,
  TName extends FieldPath<TValues>,
>({
  control,
  name,
  label,
  hideLabel,
  showStrength = false,
  className,
  ...inputProps
}: PasswordFieldProps<TValues, TName>) {
  const { field, fieldState } = useController({ control, name })
  const [revealed, setRevealed] = useState(false)

  const value = typeof field.value === "string" ? field.value : ""
  const assessment = useMemo(
    () => (showStrength ? assessPassword(value) : null),
    [showStrength, value]
  )

  const invalid = Boolean(fieldState.error)
  const meterId = `${name}-strength`

  return (
    <Field data-invalid={invalid || undefined}>
      <FieldLabel htmlFor={name} className={cn(hideLabel && "sr-only")}>
        {label}
      </FieldLabel>

      <div className="relative">
        <Input
          id={name}
          type={revealed ? "text" : "password"}
          aria-invalid={invalid || undefined}
          aria-describedby={assessment ? meterId : undefined}
          className={cn(
            "h-13 rounded-xl border-border/60 px-4 pe-12 text-[15px] shadow-none",
            className
          )}
          {...inputProps}
          {...field}
          value={value}
        />
        <button
          type="button"
          onClick={() => setRevealed((shown) => !shown)}
          aria-label={revealed ? "Hide password" : "Show password"}
          aria-pressed={revealed}
          className="absolute end-1 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          {revealed ? (
            <EyeOff className="size-4.5 stroke-[1.5]" />
          ) : (
            <Eye className="size-4.5 stroke-[1.5]" />
          )}
        </button>
      </div>

      {assessment && value.length > 0 ? (
        <div id={meterId} className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <div
              className="flex flex-1 gap-1"
              role="meter"
              aria-valuemin={1}
              aria-valuemax={3}
              aria-valuenow={METER[assessment.strength].filled}
              aria-valuetext={STRENGTH_LABEL[assessment.strength]}
              aria-label="Password strength"
            >
              {[1, 2, 3].map((segment) => (
                <span
                  key={segment}
                  className={cn(
                    "h-1.5 flex-1 rounded-full transition-colors",
                    segment <= METER[assessment.strength].filled
                      ? METER[assessment.strength].bar
                      : "bg-border"
                  )}
                />
              ))}
            </div>
            <span
              className={cn(
                "w-14 shrink-0 text-end text-[12px] font-semibold",
                METER[assessment.strength].text
              )}
            >
              {STRENGTH_LABEL[assessment.strength]}
            </span>
          </div>

          {assessment.hints.length > 0 ? (
            <FieldDescription className="text-[12px]">
              {assessment.hints[0]}
            </FieldDescription>
          ) : null}
        </div>
      ) : null}

      <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
    </Field>
  )
}
