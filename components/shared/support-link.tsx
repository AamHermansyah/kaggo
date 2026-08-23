import { cn } from "@/lib/utils"

/**
 * "Contact Support" appears on four screens. In the mock-ups it was an inert
 * `<button>`; here it opens the support mailbox, which is configurable so the
 * address does not have to be hard-coded per environment.
 */
const SUPPORT_EMAIL =
  process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "support@kaggo.app"

export function SupportLink({
  className,
  label = "Contact Support",
  subject = "MyKaggo support request",
}: {
  className?: string
  label?: string
  subject?: string
}) {
  return (
    <a
      href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}`}
      className={cn(
        "text-[14px] font-medium text-primary transition-opacity hover:underline active:opacity-70",
        className
      )}
    >
      {label}
    </a>
  )
}
