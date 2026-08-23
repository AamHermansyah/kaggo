import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import { SupportLink } from "@/components/shared/support-link"
import { Button } from "@/components/ui/button"
import { CITIES } from "@/lib/geo/cities"
import { ROUTES } from "@/lib/routes"

export const metadata: Metadata = {
  title: "Power your trips with MyKaggo",
  description:
    "Give your customers live visibility over every package you move. Register your logistics company on MyKaggo to manage batches, drivers and journeys.",
  alternates: { canonical: "/company" },
  openGraph: {
    title: "Power your trips with MyKaggo",
    description:
      "Register your logistics company on MyKaggo to manage batches, drivers and journeys.",
    url: "/company",
  },
}

export default function CompanyLandingPage() {
  return (
    <div className="relative flex flex-1 flex-col overflow-x-hidden overflow-y-auto px-5 pt-3 pb-6">
      <main className="relative flex min-h-115 flex-1 flex-col items-center justify-between overflow-hidden rounded-[24px] p-6 text-center shadow-md">
        <Image
          src="/images/hero.jpg"
          alt=""
          fill
          sizes="(max-width: 430px) 100vw, 430px"
          className="object-cover object-center brightness-55"
          priority
        />

        {/* Type scale matched to the landing page hero. */}
        <div className="relative z-10 flex flex-col items-center pt-8">
          <h1 className="mb-3 text-[32px] leading-tight font-medium text-white">
            Power your trips with MyKaggo
          </h1>
          <p className="max-w-75 text-[17px] leading-snug text-white">
            Your customers never have to worry about where their packages are
          </p>
        </div>

        <div className="relative z-10 my-auto py-6">
          <Button
            render={<Link href={ROUTES.companyRegister} />}
            nativeButton={false}
            size="lg"
            variant="secondary"
            className="flex h-13 items-center gap-2 rounded-full bg-white px-8 text-[15px] font-semibold text-primary shadow-lg transition-transform hover:bg-white/90 active:scale-98"
          >
            <Image
              src="/images/logo.png"
              alt=""
              width={40}
              height={48}
              data-icon="inline-start"
              className="size-5 shrink-0 object-contain"
            />
            Get Started
          </Button>
        </div>

        <div className="relative z-10 flex flex-col items-center pb-2">
          <h2 className="mb-2 text-[22px] font-medium text-white">
            We are everywhere
          </h2>
          <p className="max-w-75 text-[15px] leading-snug text-white/95">
            {CITIES
              .map((city) => city.label)
              .join(", ")}
          </p>
        </div>
      </main>

      <div className="flex shrink-0 justify-center pt-5 pb-2">
        <SupportLink subject="MyKaggo company enquiry" />
      </div>
    </div>
  )
}
