import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"

export default function CompanyHome() {
  return (
    <div className="flex flex-col flex-1 relative overflow-x-hidden overflow-y-auto px-5 pt-3 pb-6">
      {/* Hero Container */}
      <div className="relative rounded-[24px] overflow-hidden flex-1 min-h-115 flex flex-col items-center justify-between p-6 text-center shadow-md">
        {/* Background Image */}
        <Image
          src="/images/hero.jpg"
          alt="Logistics background"
          fill
          className="object-cover object-center brightness-55"
          priority
        />

        {/* Top Text Overlay */}
        <div className="relative z-10 flex flex-col items-center pt-8 max-w-80">
          <h2 className="text-[26px] font-bold text-white leading-tight mb-3 tracking-tight">
            Power your trips with MyKaggo
          </h2>
          <p className="text-[13.5px] text-white/90 leading-relaxed font-normal">
            Your customers never have to worry about where their packages are
          </p>
        </div>

        {/* Center CTA Button */}
        <div className="relative z-10 my-auto py-6">
          <Button
            render={<Link href="/company/register" />}
            nativeButton={false}
            size="lg"
            className="bg-white hover:bg-white/90 text-[#008967] rounded-full h-13 px-8 text-[15px] font-semibold shadow-lg active:scale-98 transition-transform flex items-center gap-2"
          >
            <MapPin className="size-4 text-[#008967] stroke-[2.5]" />
            <span>Get Started</span>
          </Button>
        </div>

        {/* Bottom Coverage Info */}
        <div className="relative z-10 flex flex-col items-center pb-2 text-center">
          <span className="text-[13px] font-medium text-white/90 mb-1">
            We are everywhere
          </span>
          <span className="text-[11.5px] text-white/75 font-normal tracking-wide">
            Lagos, Benin, Ibadan, Abuja, Akure, Portharcourt...
          </span>
        </div>
      </div>

      {/* Footer Support Link */}
      <div className="flex justify-center pt-5 pb-2 shrink-0">
        <button type="button" className="text-[#008967] text-[14px] font-medium hover:underline active:opacity-70 transition-opacity">
          Contact Support
        </button>
      </div>
    </div>
  )
}
