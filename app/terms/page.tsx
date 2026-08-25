import type { Metadata } from "next"

import { LegalPage } from "@/components/shared/legal-page"
import { TERMS } from "@/lib/content/terms"

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "The terms governing your use of the MyKaggo package tracking platform.",
  alternates: { canonical: "/terms" },
  openGraph: {
    title: "Terms and Conditions · MyKaggo",
    description: "The terms governing your use of the MyKaggo package tracking platform.",
    url: "/terms",
  },
}

export default function TermsPage() {
  return <LegalPage document={TERMS} />
}
