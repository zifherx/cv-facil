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
        href: "/cv",
        icon: FileText,
      },
      {
        title: "Crear nuevo CV",
        href: "/cv/new",
        icon: Plus,
      },
    ],
  },
  {
    label: "Cuenta",
    items: [
      {
        title: "Mi perfil",
        href: "/settings/profile",
        icon: User,
      },
      {
        title: "Configuración",
        href: "/settings/account",
        icon: Settings,
      },
    ],
  },
]

export const FULLSCREEN_ROUTES = ["/builder"]
