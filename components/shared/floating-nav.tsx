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
    { name: "Vehicle Onboarding", path: "/onboarding" },
    { name: "Dashboard: Shipments", path: "/dashboard/shipments" },
    { name: "Dashboard: Users", path: "/dashboard/users" },
    { name: "Dashboard: Vehicles", path: "/dashboard/vehicles" },
    { name: "Dashboard: Companies", path: "/dashboard/companies" },
    { name: "Company: Home", path: "/company" },
    { name: "Company: Register", path: "/company/register" },
    { name: "Company: Login", path: "/company/login" },
    { name: "Company: Dashboard", path: "/company/dashboard" },
    { name: "Company: Batch Manager", path: "/company/batches" },
    { name: "Company: Create Batch", path: "/company/batches/create" },
    { name: "Company: Package List", path: "/company/batches/2/packages" },
    { name: "Company: Assign Driver", path: "/company/batches/assign-driver" },
    { name: "Company: Vehicles", path: "/company/vehicles" },
    {
      name: "Company: Vehicle Onboarding",
      path: "/company/vehicles/onboarding",
    },
  ]

  return (
    <div className="absolute right-4 bottom-4 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="outline"
              size="icon"
              className="size-12 rounded-full border-primary/20 bg-background/80 shadow-lg backdrop-blur-md"
            >
              <Menu className="size-6 text-primary" />
            </Button>
          }
        />
        <DropdownMenuContent
          align="end"
          className="w-56 rounded-xl border-border/60 shadow-xl"
        >
          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Available Pages
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {routes.map((route) => (
              <DropdownMenuItem
                key={route.path}
                render={
                  <Link
                    href={route.path}
                    className="w-full cursor-pointer py-2.5 font-medium"
                  >
                    {route.name}
                  </Link>
                }
              />
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
