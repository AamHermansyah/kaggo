"use client"

import Link from "next/link"
import { Menu } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export function FloatingNav() {
  const routes = [
    { name: "Home", path: "/" },
    { name: "List Item", path: "/list-item" },
    { name: "Send Item", path: "/send-item" },
    { name: "Payment", path: "/payment" },
    { name: "Track Item", path: "/track" },
    { name: "Onboarding", path: "/onboarding" },
    { name: "Dashboard: Shipments", path: "/dashboard/shipments" },
    { name: "Dashboard: Users", path: "/dashboard/users" },
    { name: "Dashboard: Vehicles", path: "/dashboard/vehicles" },
  ]

  return (
    <div className="absolute bottom-4 right-4 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger render={
          <Button variant="outline" size="icon" className="h-12 w-12 rounded-full shadow-lg border-primary/20 bg-background/80 backdrop-blur-md">
            <Menu className="h-6 w-6 text-primary" />
          </Button>
        } />
        <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-xl border-border/60">
          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Available Pages</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {routes.map((route) => (
              <DropdownMenuItem key={route.path} render={
                <Link href={route.path} className="w-full cursor-pointer py-2.5 font-medium">
                  {route.name}
                </Link>
              } />
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
