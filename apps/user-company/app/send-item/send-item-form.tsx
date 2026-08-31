"use client"

import { useState } from "react"

import { BatchForm } from "./batch-form"
import { DriverForm } from "./driver-form"

type Mode = "driver" | "company"

/**
 * Switches between the two ways to list a parcel.
 *
 * Both modes existed in the mock-ups, but the logistics-company one had no
 * backend until the API's v1.1 update added `/batch-tracking/*`, so it was
 * removed rather than shipped broken. It is back now.
 *
 * The toggle is passed down as a node rather than rendered here, because the
 * design puts it between the fields and the CTA — inside each form, not
 * around them.
 */
export function SendItemForm({ riderPhone }: { riderPhone: string }) {
  const [mode, setMode] = useState<Mode>("driver")

  const modeSwitch = (
    <div className="mb-6 flex shrink-0 justify-center">
      <button
        type="button"
        onClick={() => setMode(mode === "driver" ? "company" : "driver")}
        className="cursor-pointer text-center text-[14px] font-medium text-primary transition-colors hover:underline"
      >
        {mode === "driver"
          ? "I’m tracking item through a logistics company"
          : "I’m tracking item through a driver"}
      </button>
    </div>
  )

  return mode === "driver" ? (
    <DriverForm riderPhone={riderPhone} modeSwitch={modeSwitch} />
  ) : (
    <BatchForm modeSwitch={modeSwitch} />
  )
}
