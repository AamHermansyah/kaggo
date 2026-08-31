"use client"

import Link from "next/link"
import { Menu } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

const ROUTE_GROUPS: Array<{ label: string; routes: Array<{ name: string; path: string }> }> = [
  {
    label: "Rider",
    routes: [
      { name: "Home", path: "/" },
      { name: "Identify", path: "/list-item" },
      { name: "Send Item", path: "/send-item" },
      { name: "Track Item", path: "/track" },
    ],
  },
  {
    label: "Company",
    routes: [
      { name: "Landing", path: "/company" },
      { name: "Register", path: "/company/register" },
      { name: "Login", path: "/company/login" },
      { name: "Dashboard", path: "/company/dashboard" },
      { name: "Batch Manager", path: "/company/batches" },
      { name: "Create Batch", path: "/company/batches/create" },
      { name: "Vehicles", path: "/company/vehicles" },
    ],
  },
]

export function FloatingNav() {
  if (process.env.NODE_ENV === "production") return null

  return (
    <div className="absolute right-4 bottom-4 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="outline"
              size="icon"
              aria-label="Developer route menu"
              className="size-12 rounded-full border-primary/20 bg-background/80 shadow-lg backdrop-blur-md"
            >
              <Menu className="size-6 text-primary" />
            </Button>
          }
        />
        <DropdownMenuContent
          align="end"
          className="max-h-96 w-56 overflow-y-auto rounded-xl border-border/60 shadow-xl"
        >
          {ROUTE_GROUPS.map((group, index) => (
            <DropdownMenuGroup key={group.label}>
              {index > 0 ? <DropdownMenuSeparator /> : null}
              <DropdownMenuLabel className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                {group.label}
              </DropdownMenuLabel>
              {group.routes.map((route) => (
                <DropdownMenuItem
                  key={route.path}
                  render={
                    <Link
                      href={route.path}
                      className="w-full cursor-pointer py-2 font-medium"
                    >
                      {route.name}
                    </Link>
                  }
                />
              ))}
            </DropdownMenuGroup>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
