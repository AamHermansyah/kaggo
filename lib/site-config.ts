import type { SocialNetwork } from "@/components/shared/social-icons"

/**
 * Public contact and social details.
 *
 * Everything here is `NEXT_PUBLIC_*` and read through a literal reference —
 * Next.js inlines these at build time, so `process.env[key]` would not work.
 *
 * Social links and the WhatsApp number are unset until the client sends them.
 * Anything blank is simply not rendered, so the menu never shows a dead link.
 */

/** From the client's About document. */
export const COMPANY = {
  legalName: "Rovasoft Tech Solutions Ltd",
  country: "Nigeria",
  officeHours: "Monday – Friday, 10am – 4pm",
} as const

export const SUPPORT = {
  email: process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "support@mykaggo.com",
  phone: process.env.NEXT_PUBLIC_SUPPORT_PHONE ?? "+234 816 814 4560",
  /**
   * Full `https://wa.me/...` link. Left blank until confirmed: guessing it
   * from the support phone number would send customers to whoever happens to
   * own that WhatsApp account.
   */
  whatsapp: process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP ?? "",
} as const

export interface SocialLink {
  network: SocialNetwork
  label: string
  href: string
}

const SOCIAL_HREFS: Record<SocialNetwork, string> = {
  facebook: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK ?? "",
  x: process.env.NEXT_PUBLIC_SOCIAL_X ?? "",
  linkedin: process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN ?? "",
  instagram: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM ?? "",
  tiktok: process.env.NEXT_PUBLIC_SOCIAL_TIKTOK ?? "",
}

const ORDER: SocialNetwork[] = [
  "facebook",
  "x",
  "linkedin",
  "instagram",
  "tiktok",
]

const LABELS: Record<SocialNetwork, string> = {
  facebook: "Facebook",
  x: "X",
  linkedin: "LinkedIn",
  instagram: "Instagram",
  tiktok: "TikTok",
}

/** Only the networks that actually have a URL configured. */
export function socialLinks(): SocialLink[] {
  return ORDER.filter((network) => SOCIAL_HREFS[network].trim()).map(
    (network) => ({
      network,
      label: LABELS[network],
      href: SOCIAL_HREFS[network].trim(),
    })
  )
}

/**
 * Where "Contact Support" points.
 *
 * WhatsApp when configured — the client asked for it — otherwise the support
 * mailbox, so the button is never inert.
 */
export function supportHref(subject: string): string {
  if (SUPPORT.whatsapp) {
    const separator = SUPPORT.whatsapp.includes("?") ? "&" : "?"
    return `${SUPPORT.whatsapp}${separator}text=${encodeURIComponent(subject)}`
  }
  return `mailto:${SUPPORT.email}?subject=${encodeURIComponent(subject)}`
}
