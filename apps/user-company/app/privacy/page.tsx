import type { Metadata } from "next"

import { LegalPage } from "@/components/shared/legal-page"
import { PRIVACY } from "@/lib/content/privacy"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How MyKaggo collects, uses and protects your personal data under the NDPR.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Privacy Policy · MyKaggo",
    description: "How MyKaggo collects, uses and protects your personal data under the NDPR.",
    url: "/privacy",
  },
}

export default function PrivacyPage() {
  return <LegalPage document={PRIVACY} />
}
