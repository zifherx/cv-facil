"use client"

import { AccountEmail } from "@/components/modules/(Account)/Account-Email"
import { AccountNotifications } from "@/components/modules/(Account)/Account-Notifications"
import { AccountPassword } from "@/components/modules/(Account)/Account-Password"
import { AccountSkeleton } from "@/components/modules/(Account)/Account-Skeleton"
import { useAccount, useUserId } from "@/hooks"
import { AlertCircle } from "lucide-react"

export function AccountView() {
  const userId = useUserId()
  const { data: account, isLoading, isError } = useAccount(userId ?? "")

  if (isLoading) return <AccountSkeleton />

  if (isError || !account) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
        <AlertCircle className="h-4 w-4 shrink-0" />
        No se pudo cargar la configuración de cuenta. Intenta recargar la
        página.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <AccountEmail account={account} userId={userId!} />
      <AccountPassword />
      <AccountNotifications account={account} userId={userId!} />
    </div>
  )
}
