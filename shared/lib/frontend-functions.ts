import { NAV_GROUPS_APP_SIDEBAR } from "@/lib/constants"
import { IBreadcrumb } from "@/types"

export const getBreadcrumb = (pathname: string): IBreadcrumb[] => {
  const allItems = NAV_GROUPS_APP_SIDEBAR.flatMap((g) => g.items)
  const matched = allItems.find(
    (item) =>
      pathname === item.href ||
      (item.href !== "/dashboard" && pathname.startsWith(item.href))
  )

  if (!matched) return [{ label: "Dashboard", href: "/dashboard" }]
  if (matched.href === "/dashboard")
    return [{ label: "Dashboard", href: "/dashboard" }]

  return [
    { label: "Dashboard", href: "/dashboard" },
    { label: matched.title, href: matched.href },
  ]
}
