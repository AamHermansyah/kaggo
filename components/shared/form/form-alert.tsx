"use client"

import { AlertCircle } from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"

/**
 * Form-level failure banner: only for messages no single input owns
 * ("Invalid email or password", "The server is unreachable"). Field-specific
 * messages render under their control via `FieldError`.
 */
export function FormAlert({
  message,
  className,
}: {
  message: string | null | undefined
  className?: string
}) {
  if (!message) return null

  return (
    <Alert
      variant="destructive"
      aria-live="polite"
      className={cn("border-destructive/30 bg-destructive/5", className)}
    >
      <AlertCircle />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
}
