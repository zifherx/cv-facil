import { Metadata } from "next"
import { DashboardView } from "./components/Dashboard-View"

export const metadata: Metadata = { title: "Dashboard — cvfácil" }

export default function DashboardPage() {
  return <DashboardView />
}
