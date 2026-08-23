import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Building2 } from "lucide-react"

import { SupportLink } from "@/components/shared/support-link"
import { env } from "@/lib/env"
import { CITIES } from "@/lib/geo/cities"
import { ROUTES } from "@/lib/routes"

export const metadata: Metadata = {
  title: "Track it with MyKaggo",
  description:
    "Keep an eye on your package from departure to your destination. MyKaggo tracks intercity road deliveries across Nigeria with live GPS.",
  alternates: { canonical: "/" },
}

/**
 * Structured data so search engines can render a rich result for the brand and
 * expose the tracking entry point as a site search action.
 */
function StructuredData() {
  const site = env.NEXT_PUBLIC_SITE_URL

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${site}/#organization`,
        name: "MyKaggo",
        url: site,
        logo: `${site}/images/logo.png`,
        areaServed: CITIES.map((city) => city.label),
      },
      {
        "@type": "WebSite",
        "@id": `${site}/#website`,
        url: site,
        name: "MyKaggo",
        publisher: { "@id": `${site}/#organization` },
        inLanguage: "en-NG",
      },
      {
        "@type": "Service",
        name: "Parcel tracking",
        provider: { "@id": `${site}/#organization` },
        serviceType: "Intercity parcel tracking",
        areaServed: { "@type": "Country", name: "Nigeria" },
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      // Serialised from a literal above — no user input reaches this string.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export default function HomePage() {
  return (
    <div className="relative flex flex-1 flex-col overflow-x-hidden overflow-y-auto px-5 pt-3 pb-6">
      <StructuredData />

      {/* Same hero treatment as /company: a rounded card with the photo as a
          real <Image fill> rather than a CSS background, so Next.js can size
          and preload it. `brightness-55` replaces the old gradient overlay. */}
      <main className="relative flex min-h-115 flex-1 flex-col items-center justify-between overflow-hidden rounded-[24px] p-6 text-center shadow-md">
        <Image
          src="/images/hero.jpg"
          alt=""
          fill
          sizes="(max-width: 430px) 100vw, 430px"
          className="object-cover object-center brightness-55"
          priority
        />

        <div className="relative z-10 flex flex-col items-center pt-8">
          <h1 className="mb-3 text-[32px] leading-tight font-medium text-white">
            Track it with MyKaggo
          </h1>
          <p className="mb-10 max-w-75 text-[17px] leading-snug text-white">
            Keep an eye on your package from departure to your destination
          </p>

          <Link
            href={ROUTES.track}
            className="flex w-full max-w-85 items-center gap-3 rounded-[30px] bg-background px-6 py-4.5 text-foreground shadow-sm transition-transform active:scale-98"
          >
            <Image
              src="/images/logo.png"
              alt=""
              width={40}
              height={48}
              className="size-5 shrink-0 object-contain"
            />
            <span className="text-[15px] font-medium">
              Track it with your phone number
            </span>
          </Link>
        </div>

        <div className="relative z-10 flex flex-col items-center pb-2">
          <h2 className="mb-2 text-[22px] font-medium text-white">
            Where are you sending to?
          </h2>
          <p className="max-w-75 text-[15px] leading-snug text-white/95">
            {CITIES.map((city) => city.label).join(", ")}
          </p>
        </div>
      </main>

      {/*
        The only route from the rider side into the company portal. An installed
        PWA has no address bar, so without a visible link a logistics operator
        who opened the app could never reach their own sign-in.
      */}
      <footer className="flex shrink-0 flex-col items-center gap-3 pt-5 pb-2">
        <Link
          href={ROUTES.companyHome}
          className="flex items-center gap-1.5 text-[14px] font-medium text-primary transition-opacity hover:underline active:opacity-70"
        >
          <Building2 className="size-4 stroke-[1.5]" />
          For logistics companies
        </Link>
        <SupportLink className="text-[15px]" />
      </footer>
    </div>
  )
}
