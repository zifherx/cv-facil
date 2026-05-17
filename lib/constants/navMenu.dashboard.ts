import { NavGroup } from "@/types"
import { FileText, LayoutDashboard, Plus, Settings, User } from "lucide-react"

export const NAV_GROUPS_APP_SIDEBAR: NavGroup[] = [
  {
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "Mis CVs",
    items: [
      {
        title: "Todos mis CVs",
        href: "/dashboard/cvs",
        icon: FileText,
      },
      {
        title: "Crear nuevo CV",
        href: "/dashboard/cvs/new",
        icon: Plus,
      },
    ],
  },
  {
    label: "Cuenta",
    items: [
      {
        title: "Mi perfil",
        href: "/dashboard/settings/profile",
        icon: User,
      },
      {
        title: "Configuración",
        href: "/dashboard/settings/account",
        icon: Settings,
      },
    ],
  },
]

export const FULLSCREEN_ROUTES = ["/builder"]
