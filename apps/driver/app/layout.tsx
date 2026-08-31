import type { Metadata, Viewport } from "next"
import { Geist_Mono, Instrument_Sans } from "next/font/google"

import "./globals.css"
import Header from "@/components/shared/header"
import { SwRegister } from "@/components/shared/sw-register"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { APPLE_SPLASH_SCREENS } from "@/lib/splash-screens"
import { cn } from "@/lib/utils"

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

const TITLE = "MyKaggo Driver — Vehicle & GPS Tracking Portal"
const DESCRIPTION =
  "Driver vehicle lookup, live GPS device status and journey monitoring for MyKaggo drivers across Nigeria."

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001"),
  title: { default: "MyKaggo Driver", template: "%s · MyKaggo Driver" },

  description: DESCRIPTION,
  applicationName: "MyKaggo Driver",
  keywords: [
    "driver portal",
    "kaggo driver",
    "vehicle lookup",
    "gps tracking",
    "nigeria logistics driver",
  ],
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    siteName: "MyKaggo Driver",
    title: TITLE,
    description: DESCRIPTION,
    url: "/",
    locale: "en_NG",
    images: [
      {
        url: "/images/hero.jpg",
        width: 1200,
        height: 630,
        alt: "MyKaggo Driver Portal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/images/hero.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  appleWebApp: {
    capable: true,
    title: "MyKaggo Driver",
    statusBarStyle: "default",
    startupImage: [...APPLE_SPLASH_SCREENS],
  },
  formatDetection: { telephone: false },
  other: {
    "apple-mobile-web-app-capable": "yes",
  },
}

export const viewport: Viewport = {
  themeColor: "#008967",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
}

export default function DriverRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en-NG"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        instrumentSans.variable
      )}
    >
      <body className="bg-muted">
        <ThemeProvider>
          <div className="relative mx-auto flex h-dvh max-w-107.5 flex-col overflow-y-auto bg-background">
            <Header />
            <main className="relative flex flex-1 flex-col overflow-x-hidden overflow-y-auto px-5 pt-3 pb-6">
              {children}
            </main>
            <SwRegister />
          </div>
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  )
}
