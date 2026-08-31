import type { Metadata } from "next"
import { DriverView } from "./driver-view"

export const metadata: Metadata = {
  title: "MyKaggo Driver Portal",
  description: "Vehicle monitoring and GPS status for MyKaggo drivers",
}

export default function DriverPage() {
  return <DriverView />
}
