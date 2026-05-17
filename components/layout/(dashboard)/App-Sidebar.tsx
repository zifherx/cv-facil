"use client"

import { NavMenuItem } from "@/components/modules/(AppSidebar)/Nav-Menu-Item"
import { SidebarLogo } from "@/components/modules/(AppSidebar)/Sidebar-Logo"
import { UserFooter } from "@/components/modules/(AppSidebar)/User-Footer"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { NAV_GROUPS_APP_SIDEBAR } from "@/lib/constants"
import { usePathname } from "next/navigation"

export function AppSidebar() {
  const pathname = usePathname()

  const isActive = (href: string) =>
    href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(href)

  return (
    <Sidebar collapsible="icon" variant="inset">
      {/* Header - logo */}
      <SidebarHeader className="pt-4 pb-3">
        <SidebarLogo />
      </SidebarHeader>

      <SidebarSeparator />

      {/* Content - nav groups */}
      <SidebarContent>
        {NAV_GROUPS_APP_SIDEBAR.map((group, gi) => (
          <SidebarGroup key={gi}>
            {group.label && (
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            )}
            <SidebarMenu>
              {group.items.map((item) => (
                <NavMenuItem
                  key={item.href}
                  item={item}
                  isActive={isActive(item.href)}
                />
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarSeparator />

      {/* Footer - user info + logout */}
      <SidebarFooter className="pb-4">{<UserFooter />}</SidebarFooter>

      {/* Rail - collapse handle on desktop */}
      <SidebarRail />
    </Sidebar>
  )
}
