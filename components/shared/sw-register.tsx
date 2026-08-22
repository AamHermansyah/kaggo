"use client"

import { useEffect } from "react"

export function SwRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("SW registered:", registration.scope)
          // Pull a fresh sw.js so a new cache version rolls out on next visit
          registration.update()
        })
        .catch((error) => {
          console.log("SW registration failed:", error)
        })
    }
  }, [])

  return null
}
