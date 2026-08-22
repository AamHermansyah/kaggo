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
      className="relative flex flex-1 flex-col overflow-x-hidden overflow-y-auto px-5 pt-8 pb-6"
    >
      {/* Title */}
      <h2 className="mb-8 shrink-0 text-[20px] font-bold tracking-tight text-foreground">
        Login to your company account
      </h2>

      {/* Form Inputs */}
      <div className="mb-6 flex shrink-0 flex-col gap-4">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-13 rounded-xl border-border/60 px-4 text-[15px] shadow-none"
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="h-13 rounded-xl border-border/60 px-4 text-[15px] shadow-none"
        />
      </div>

      {/* Register Link */}
      <div className="mb-6 flex shrink-0 justify-center text-[13.5px]">
        <span className="mr-1.5 text-foreground/70">
          Don’t have an account?
        </span>
        <Link
          href="/company/register"
          className="font-semibold text-[#008967] hover:underline"
        >
          Create Account
        </Link>
      </div>

      <div className="flex-1"></div>

      {/* Submit CTA */}
      <Button
        type="submit"
        size="lg"
        className="mt-auto h-13 w-full shrink-0 rounded-full bg-[#008967] text-[15px] font-semibold text-white shadow-none transition-transform hover:bg-[#007558] active:scale-98"
      >
        Login
      </Button>
    </form>
  )
}
