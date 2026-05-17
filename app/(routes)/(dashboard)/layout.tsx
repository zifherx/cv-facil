import { AppSidebar } from "@/components/layout/(dashboard)/App-Sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { ReactNode } from "react"
import { DashboardHeader } from "../../../components/layout/(dashboard)/Dashboard-Header"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  // const cookieStore = await cookies()
  // const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false"

  return (
    <SidebarProvider>
      {/* Sidebar izquierdo */}
      <AppSidebar />

      {/* Area principal */}
      <SidebarInset>
        <DashboardHeader />
        {/* <main className="flex-1 border-2 border-black p-6"> */}
        {children}
        {/* </main> */}
      </SidebarInset>
    </SidebarProvider>
  )
}
