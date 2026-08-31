"use client"

import { useActionState } from "react"
import { Battery, Building2, Car, CheckCircle2, MessageCircle, Phone, RefreshCw, Search, ShieldAlert, User, Zap } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { supportHref } from "@/lib/site-config"
import { lookupDriverVehicleAction, type DriverLookupState } from "./actions"

const initialState: DriverLookupState = { status: "idle" }

export function DriverView() {
  const [state, formAction, isPending] = useActionState(
    lookupDriverVehicleAction,
    initialState
  )

  return (
    <div className="flex flex-col gap-6 py-2">
      {/* Header card */}
      <div className="flex flex-col gap-1.5 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Driver Portal
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your phone number or vehicle plate to check vehicle & GPS status
        </p>
      </div>

      {/* Search form */}
      <form action={formAction} className="flex flex-col gap-3">
        <div className="relative">
          <Input
            name="query"
            type="text"
            placeholder="e.g. 08031234567 or LAG-123-XY"
            required
            autoComplete="off"
            className="h-12 rounded-xl bg-card pl-11 text-base shadow-xs"
          />
          <Search className="absolute top-3.5 left-3.5 size-5 text-muted-foreground" />
        </div>

        <Button
          type="submit"
          disabled={isPending}
          className="h-12 w-full rounded-xl bg-primary text-base font-semibold text-primary-foreground shadow-sm transition-transform active:scale-98"
        >
          {isPending ? (
            <>
              <RefreshCw className="size-4 animate-spin" />
              Searching vehicle...
            </>
          ) : (
            <>
              <Search className="size-4" />
              Find My Vehicle
            </>
          )}
        </Button>
      </form>

      {/* Error state */}
      {state.status === "error" && (
        <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          <ShieldAlert className="size-5 shrink-0" />
          <p>{state.message}</p>
        </div>
      )}

      {/* Success state: Vehicle card & GPS status */}
      {state.status === "success" && state.vehicle && (
        <div className="flex flex-col gap-4">
          <Card className="rounded-2xl border-border/80 shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Badge
                  variant={state.vehicle.deviceConnected ? "default" : "secondary"}
                  className="gap-1.5 py-1 text-xs"
                >
                  <span
                    className={`size-2 rounded-full ${
                      state.vehicle.deviceConnected ? "bg-emerald-400" : "bg-amber-400"
                    }`}
                  />
                  {state.vehicle.deviceConnected ? "GPS Active & Connected" : "GPS Standby"}
                </Badge>
                {state.vehicle.batteryLevel !== null && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Battery className="size-4" />
                    {state.vehicle.batteryLevel}%
                  </span>
                )}
              </div>
              <CardTitle className="text-xl font-bold">
                {state.vehicle.plateNumber}
              </CardTitle>
              <CardDescription className="text-sm">
                {state.vehicle.colour} {state.vehicle.make} {state.vehicle.model}
              </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-3 pt-2">
              <div className="grid grid-cols-1 gap-2.5 rounded-xl bg-muted/50 p-3.5 text-sm">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <User className="size-4" /> Driver Name
                  </span>
                  <span className="font-medium text-foreground">
                    {state.vehicle.driverFullName || "Registered Driver"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="size-4" /> Phone
                  </span>
                  <span className="font-mono font-medium text-foreground">
                    {state.vehicle.driverPhone}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Building2 className="size-4" /> Company
                  </span>
                  <span className="font-medium text-foreground">
                    {state.vehicle.companyName || "Individual Operator"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-xl bg-primary/10 p-3 text-xs text-primary">
                <Zap className="size-4 shrink-0" />
                <span>
                  GPS terminal is awake. Your location is being securely reported during active journeys.
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick driver support redirect */}
      <div className="mt-auto flex flex-col items-center gap-3 pt-6 text-center">
        <p className="text-xs text-muted-foreground">
          Need assistance or device replacement on the road?
        </p>
        <a
          href={supportHref("Driver assistance request")}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          <MessageCircle className="size-4 text-primary" />
          Contact Driver Support
        </a>
      </div>
    </div>
  )
}
