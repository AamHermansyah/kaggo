import Link from "next/link"
import Image from "next/image"

export default function Page() {
  return (
    <div className="relative flex flex-1 flex-col">
      {/* Hero Content */}
      <main
        className="flex flex-1 flex-col bg-cover bg-center px-6 pt-16 pb-12 text-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url('/images/hero.jpg')`,
        }}
      >
        <div className="flex flex-1 flex-col items-center">
          <h1 className="mb-3 text-[32px] leading-tight font-medium text-white">
            Track it with Kaggo
          </h1>
          <p className="mb-10 max-w-75 text-[17px] leading-snug text-white">
            Keep an eye on your package from departure to your destination
          </p>

          <Link
            href="/track"
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

        <div className="mt-auto flex flex-col items-center pt-10">
          <h2 className="mb-2 text-[22px] font-medium text-white">
            Where are you sending to?
          </h2>
          <p className="max-w-75 text-[15px] leading-snug text-white/95">
            Lagos, Benin, Ibadan, Abuja, Akure, Portharcourt
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="shrink-0 p-5 text-center">
        <button className="text-[15px] font-medium text-primary transition-opacity hover:underline active:opacity-70">
          Contact Support
        </button>
      </footer>
    </div>
  )
}
