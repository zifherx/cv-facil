"use client"

import { Badge } from "@/components/ui/badge"
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { NAV_MENU_ITEM_PROPS } from "@/types"
import Link from "next/link"

export function NavMenuItem({ isActive, item }: NAV_MENU_ITEM_PROPS) {
  const IconoItem = item.icon
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        tooltip={item.title}
        className={cn(
          "transition-colors",
          isActive &&
            "bg-[#FAECE7] text-[#993C1D] hover:bg-[#FAECE7] hover:text-[#993C1D]"
        )}
      >
        <Link href={item.href}>
          <IconoItem className="h-4 w-4" />
          <span>{item.title}</span>
          {item.badge && (
            <Badge variant="secondary" className="ml-auto h-5 px-1.5 text-xs">
              {item.badge}
            </Badge>
          )}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}
