import { MessageCircle } from "lucide-react"

import { supportHref, SUPPORT } from "@/lib/site-config"
import { cn } from "@/lib/utils"

/**
 * "Contact Support" appears on several screens. In the mock-ups it was an inert
 * `<button>`.
 *
 * The client asked for it to open WhatsApp. It does as soon as
 * `NEXT_PUBLIC_SUPPORT_WHATSAPP` is set; until then it falls back to the
 * support mailbox rather than being a dead control.
 */
export function SupportLink({
  className,
  label = "Contact Support",
  subject = "MyKaggo support request",
}: {
  className?: string
  label?: string
  subject?: string
}) {
  const isWhatsApp = Boolean(SUPPORT.whatsapp)

  return (
    <a
      href={supportHref(subject)}
      {...(isWhatsApp
        ? { target: "_blank", rel: "noopener noreferrer" }
        : null)}
      className={cn(
        "inline-flex items-center gap-1.5 text-[14px] font-medium text-primary transition-opacity hover:underline active:opacity-70",
        className
      )}
    >
      {isWhatsApp ? <MessageCircle className="size-4 shrink-0" /> : null}
      {label}
    </a>
  )
}
