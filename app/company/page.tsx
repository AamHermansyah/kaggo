import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"

export default function CompanyHome() {
  return (
    <div className="relative flex flex-1 flex-col overflow-x-hidden overflow-y-auto px-5 pt-3 pb-6">
      {/* Hero Container */}
      <div className="relative flex min-h-115 flex-1 flex-col items-center justify-between overflow-hidden rounded-[24px] p-6 text-center shadow-md">
        {/* Background Image */}
        <Image
          src="/images/hero.jpg"
          alt="Logistics background"
          fill
          className="object-cover object-center brightness-55"
          priority
        />

        {/* Top Text Overlay */}
        <div className="relative z-10 flex max-w-80 flex-col items-center pt-8">
          <h2 className="mb-3 text-[26px] leading-tight font-bold tracking-tight text-white">
            Power your trips with MyKaggo
          </h2>
          <p className="text-[13.5px] leading-relaxed font-normal text-white/90">
            Your customers never have to worry about where their packages are
          </p>
        </div>

        {/* Center CTA Button */}
        <div className="relative z-10 my-auto py-6">
          <Button
            render={<Link href="/company/register" />}
            nativeButton={false}
            size="lg"
            className="flex h-13 items-center gap-2 rounded-full bg-white px-8 text-[15px] font-semibold text-[#008967] shadow-lg transition-transform hover:bg-white/90 active:scale-98"
          >
            <MapPin className="size-4 stroke-[2.5] text-[#008967]" />
            <span>Get Started</span>
          </Button>
        </div>

        {/* Bottom Coverage Info */}
        <div className="relative z-10 flex flex-col items-center pb-2 text-center">
          <span className="mb-1 text-[13px] font-medium text-white/90">
            We are everywhere
          </span>
          <span className="text-[11.5px] font-normal tracking-wide text-white/75">
            Lagos, Benin, Ibadan, Abuja, Akure, Portharcourt...
          </span>
        </div>
      </div>

      {/* Footer Support Link */}
      <div className="flex shrink-0 justify-center pt-5 pb-2">
        <button
          type="button"
          className="text-[14px] font-medium text-[#008967] transition-opacity hover:underline active:opacity-70"
        >
          Contact Support
        </button>
      </div>
    </div>
  )
}
