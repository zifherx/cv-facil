"use client"

import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { getBreadcrumb } from "@/shared/lib/frontend-functions"
import { usePathname } from "next/navigation"

export function DashboardHeader() {
  const pathname = usePathname()
  const crumbs = getBreadcrumb(pathname)

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      {/* Sidebar toggle */}
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />

      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-sm"
      >
        {crumbs.map((crumb, i) => (
          <span key={crumb.href} className="flex items-center gap-1.5">
            {i > 0 && <span className="text-muted-foreground">/</span>}
            <span
              className={
                i === crumbs.length - 1
                  ? "font-medium text-foreground"
                  : "text-muted-foreground transition-colors hover:text-foreground"
              }
            >
              {crumb.label}
            </span>
          </span>
        ))}
      </nav>
    </header>
  )
}
