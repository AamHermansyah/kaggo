import type { Metadata } from "next"

import { LegalPage } from "@/components/shared/legal-page"
import { ABOUT } from "@/lib/content/about"

export const metadata: Metadata = {
  title: "About MyKaggo",
  description: "Why MyKaggo exists: real-time visibility for packages moving between Nigerian cities on shared transport.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About MyKaggo · MyKaggo",
    description: "Why MyKaggo exists: real-time visibility for packages moving between Nigerian cities on shared transport.",
    url: "/about",
  },
}

export default function AboutPage() {
  return <LegalPage document={ABOUT} />
}
