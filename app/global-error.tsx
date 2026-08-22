"use client"

import { useEffect } from "react"

import "./globals.css"

/**
 * Last-resort boundary: catches failures in the root layout itself, where
 * `app/error.tsx` cannot help because the layout it lives in never rendered.
 *
 * It replaces the root layout while active, so it must ship its own `<html>`
 * and `<body>`. Client Components cannot export `metadata`, hence the inline
 * `<title>`.
 */
export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  useEffect(() => {
    console.error("[app/global-error]", error)
  }, [error])

  return (
    <html lang="en">
      <body className="bg-muted antialiased">
        <title>Something went wrong · Kaggo</title>
        <main className="mx-auto flex h-dvh max-w-107.5 flex-col items-center justify-center gap-6 bg-background px-6 text-center">
          <div className="flex flex-col gap-2">
            <p className="text-[13px] font-semibold tracking-widest text-destructive uppercase">
              Error 500
            </p>
            <h1 className="text-[24px] font-bold tracking-tight text-foreground">
              Kaggo failed to start
            </h1>
            <p className="max-w-80 text-[14px] leading-relaxed text-foreground/70">
              A critical error stopped the app from rendering. Please try again.
            </p>
            {error.digest ? (
              <p className="mt-1 font-mono text-[12px] text-foreground/45">
                Reference: {error.digest}
              </p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => unstable_retry()}
            className="h-13 w-full max-w-80 rounded-full bg-primary text-[15px] font-semibold text-primary-foreground transition-transform active:scale-98"
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  )
}
