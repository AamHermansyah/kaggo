"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function CompanyLoginPage() {
  const router = useRouter()
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    router.push("/company/dashboard")
  }

  return (
    <form
      onSubmit={handleLogin}
      className="flex flex-col flex-1 px-5 pt-8 pb-6 relative overflow-x-hidden overflow-y-auto"
    >
      {/* Title */}
      <h2 className="text-[20px] font-bold text-foreground tracking-tight mb-8 shrink-0">
        Login to your company account
      </h2>

      {/* Form Inputs */}
      <div className="flex flex-col gap-4 mb-6 shrink-0">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-13 rounded-xl text-[15px] px-4 border-border/60 shadow-none"
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="h-13 rounded-xl text-[15px] px-4 border-border/60 shadow-none"
        />
      </div>

      {/* Register Link */}
      <div className="flex justify-center mb-6 shrink-0 text-[13.5px]">
        <span className="text-foreground/70 mr-1.5">Don’t have an account?</span>
        <Link
          href="/company/register"
          className="text-[#008967] font-semibold hover:underline"
        >
          Create Account
        </Link>
      </div>

      <div className="flex-1"></div>

      {/* Submit CTA */}
      <Button
        type="submit"
        size="lg"
        className="w-full rounded-full h-13 text-[15px] font-semibold bg-[#008967] hover:bg-[#007558] text-white active:scale-98 transition-transform shadow-none mt-auto shrink-0"
      >
        Login
      </Button>
    </form>
  )
}
