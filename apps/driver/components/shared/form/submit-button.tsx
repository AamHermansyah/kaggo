"use client"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

/**
 * Primary form CTA in the shape every screen in the designs uses: full width,
 * pill, brand green. Disabled while the action is in flight so a double tap
 * cannot submit twice.
 */
export function SubmitButton({
  pending,
  children,
  pendingLabel,
  className,
  disabled,
  ...props
}: React.ComponentProps<typeof Button> & {
  pending?: boolean
  pendingLabel?: string
}) {
  return (
    <Button
      type="submit"
      size="lg"
      aria-busy={pending}
      disabled={pending || disabled}
      className={cn(
        "h-13 w-full shrink-0 rounded-full text-[15px] font-semibold shadow-none transition-transform active:scale-98",
        className
      )}
      {...props}
    >
      {pending ? (
        <>
          <Spinner data-icon="inline-start" />
          {pendingLabel ?? "Please wait"}
        </>
      ) : (
        children
      )}
    </Button>
  )
}
