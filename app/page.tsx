import Link from "next/link"
import Image from "next/image"

export default function Page() {

  return (
    <div className="flex flex-col flex-1 relative">
      {/* Hero Content */}
      <main 
        className="flex-1 flex flex-col px-6 pt-16 pb-12 text-center bg-cover bg-center"
        style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url('/images/hero.jpg')` }}
      >
        <div className="flex flex-col items-center flex-1">
          <h1 className="text-[32px] font-medium text-white leading-tight mb-3">
            Track it with Kaggo
          </h1>
          <p className="text-white text-[17px] leading-snug mb-10 max-w-75">
            Keep an eye on your package from departure to your destination
          </p>

          <Link href="/track" className="flex items-center gap-3 bg-background text-foreground rounded-[30px] px-6 py-4.5 w-full max-w-85 shadow-sm active:scale-98 transition-transform">
            <Image
              src="/images/logo.png"
              alt=""
              width={40}
              height={48}
              className="size-5 shrink-0 object-contain"
            />
            <span className="text-[15px] font-medium">Track it with your phone number</span>
          </Link>
        </div>

        <div className="flex flex-col items-center mt-auto pt-10">
          <h2 className="text-[22px] font-medium text-white mb-2">
            Where are you sending to?
          </h2>
          <p className="text-white/95 text-[15px] leading-snug max-w-75">
            Lagos, Benin, Ibadan, Abuja, Akure, Portharcourt
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-5 text-center shrink-0">
        <button className="text-primary font-medium text-[15px] hover:underline active:opacity-70 transition-opacity">
          Contact Support
        </button>
      </footer>
    </div>
  )
}
