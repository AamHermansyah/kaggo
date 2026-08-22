import { Geist_Mono, Instrument_Sans } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";
import Header from "@/components/shared/header"
import { Toaster } from "@/components/ui/sonner"
import { FloatingNav } from "@/components/shared/floating-nav"
import { SwRegister } from "@/components/shared/sw-register"

const instrumentSans = Instrument_Sans({ subsets: ['latin'], variable: '--font-sans' })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata = {
  title: "MyKaggo",
  description: "Track it with MyKaggo!",
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "MyKaggo",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", instrumentSans.variable)}
    >
      <body className="bg-muted">
        <ThemeProvider>
          <div className="bg-background max-w-107.5 mx-auto h-dvh overflow-y-auto flex flex-col relative">
            <Header />
            {children}
            <FloatingNav />
            <SwRegister />
          </div>
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  )
}
