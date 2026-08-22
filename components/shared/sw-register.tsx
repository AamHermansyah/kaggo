"use client"

import { useEffect } from "react"

/**
 * Registers the PWA service worker.
 *
 * `registration.update()` on every load pulls a fresh `sw.js`, which is what
 * rolls the cache version forward — important here, because the previous
 * worker cached authenticated pages and needs to be replaced on devices that
 * already installed it.
 */
export function SwRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return

    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => registration.update())
      .catch((error) => {
        if (process.env.NODE_ENV !== "production") {
          console.warn("Service worker registration failed:", error)
        }
      })
  }, [])

  return null
}
