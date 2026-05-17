import { NAV_GROUPS_APP_SIDEBAR } from "@/lib/constants"
import { LucideIcon } from "lucide-react"

export type NAV_MENU_ITEM_PROPS = {
  item: (typeof NAV_GROUPS_APP_SIDEBAR)[number]["items"][number]
  isActive: boolean
}

export interface NavItem {
  title: string
  href: string
  icon: LucideIcon
  badge?: string | number
  disabled?: boolean
  children?: ChildrenNav[]
}

export type ChildrenNav = Omit<NavItem, "icon" | "children">

export interface NavGroup {
  label?: string
  items: NavItem[]
}

export interface IBreadcrumb {
  label: string
  href: string
}

export interface IStatDashboardPage {
  title: string
  value: string | number
  icon: LucideIcon
  desc: string
  color: string
  bg: string
}
