import { AppSidebar } from "@/components/layout/(dashboard)/App-Sidebar"
import { DashboardHeader } from "@/components/layout/(dashboard)/Dashboard-Header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { cookies } from "next/headers"
import { ReactNode } from "react"

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false"

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      {/* Sidebar izquierdo */}
      <AppSidebar />

      {/* Area principal */}
      <SidebarInset>
        <DashboardHeader />
        <main className="flex-1 p-5">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
