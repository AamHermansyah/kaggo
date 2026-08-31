import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { env } from "@/lib/env"
import { CITIES } from "@/lib/geo/cities"
import { ROUTES } from "@/lib/routes"
import { SUPPORT, socialLinks } from "@/lib/site-config"

export const metadata: Metadata = {
  title: "Track it with MyKaggo",
  description:
    "Keep an eye on your package from departure to arrival. MyKaggo tracks intercity road deliveries across Nigeria with live GPS.",
  alternates: { canonical: "/" },
}

/**
 * Structured data so search engines can render a rich result for the brand and
 * expose the tracking entry point as a site search action.
 */
function StructuredData() {
  const site = env.NEXT_PUBLIC_SITE_URL
  const socials = socialLinks().map((s) => s.href)

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${site}/#organization`,
        name: "MyKaggo",
        url: site,
        logo: `${site}/images/logo.png`,
        email: SUPPORT.email,
        sameAs: socials,
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer support",
          email: SUPPORT.email,
          url: SUPPORT.whatsapp || undefined,
        },
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
    <div className="relative flex flex-1 flex-col overflow-hidden">
      <StructuredData />

      <main className="relative flex h-full flex-1 flex-col items-center justify-between px-6 py-8 text-center sm:py-10">
        <Image
          src="/images/hero.jpg"
          alt=""
          fill
          sizes="(max-width: 430px) 100vw, 430px"
          className="object-cover object-[center_30%]"
          priority
        />
        {/* Darkening linear gradient overlay for crisp contrast */}
        <div
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(180deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.25) 45%, rgba(0, 0, 0, 0.8) 100%)",
          }}
        />

        {/* Top Header Texts */}
        <div className="relative z-10 flex flex-col items-center pt-2 sm:pt-4">
          <h1 className="text-[28px] sm:text-[32px] font-bold leading-tight tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            Track it with MyKaggo
          </h1>
          <p className="mt-2.5 max-w-[280px] text-[14.5px] sm:text-[15.5px] leading-snug font-medium text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
            Keep an eye on your package from departure to arrival
          </p>
        </div>

        {/* Middle CTA Button */}
        <div className="relative z-10 my-auto py-6 w-full flex justify-center">
          <Link
            href={ROUTES.track}
            className="flex h-13.5 sm:h-14 w-full max-w-[310px] items-center justify-center gap-3 rounded-full bg-white px-6 text-[15.5px] sm:text-[16.5px] font-semibold text-neutral-900 shadow-2xl transition-transform active:scale-98 hover:bg-neutral-50"
          >
            <span>Track your package</span>
            <ArrowRight className="size-5 stroke-[2.5] text-primary" />
          </Link>
        </div>

        {/* Bottom Destination Section */}
        <div className="relative z-10 flex flex-col items-center pb-2 sm:pb-4">
          <h2 className="text-[21px] sm:text-[23px] font-bold tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
            Where are you sending to?
          </h2>
          <p className="mt-2 max-w-[325px] text-[13px] sm:text-[13.5px] leading-relaxed font-normal text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]">
            Wherever your item is going in Nigeria, MyKaggo keeps you in the
            know, from the moment it leaves to the moment it arrives.
          </p>
        </div>
      </main>
    </div>
  )
}

