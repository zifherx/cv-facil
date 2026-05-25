"use client"

import { ITabProfile } from "@/types"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "../../../lib"

const TABS: ITabProfile[] = [
  { label: "Perfil", href: "/settings/profile" },
  { label: "Cuenta", href: "/settings/account" },
  { label: "Suscripción", href: "/settings/subscription", disabled: true },
] as const

export function SettingsTabs() {
  const pathname = usePathname()

  return (
    <div className="space-y-1">
      <h1 className="text-2xl font-semibold tracking-tight">Ajustes</h1>

      <nav>
        {TABS.map((tab) => {
          const isActive = pathname.startsWith(tab.href)

          if (tab.disabled) {
            return (
              <span
                key={tab.href}
                className="inline-flex cursor-not-allowed items-center px-4 py-2.5 text-sm text-muted-foreground/50"
              >
                {tab.label}
              </span>
            )
          }

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "inline-flex items-center border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "border-[#D85A30] text-[#D85A30]"
                  : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
              )}
            >
              {tab.label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
