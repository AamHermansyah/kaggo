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

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3002"),
  title: { default: "MyKaggo Admin", template: "%s · MyKaggo Admin" },

  description: "MyKaggo Administrative Dashboard",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "MyKaggo Admin",
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

export default function AdminRootLayout({
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
            <div className="relative flex flex-1 flex-col overflow-x-hidden overflow-y-auto px-5 pt-2 pb-6">
              {children}
            </div>
            <SwRegister />
          </div>
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  )
}
