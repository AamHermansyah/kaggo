"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Payment() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/send-item/success")
    }, 1000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
      <h2 className="text-xl font-medium text-foreground">
        Payment Gateway Web Link Redirect
      </h2>
    </div>
  )
}
