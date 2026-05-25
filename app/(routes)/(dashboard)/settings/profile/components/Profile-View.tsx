"use client"

import { ProfileAddress } from "@/components/modules/(Profile)/Profile-Address"
import { ProfileAvatar } from "@/components/modules/(Profile)/Profile-Avatar"
import { ProfilePersonalInfo } from "@/components/modules/(Profile)/Profile-Personal-Info"
import { ProfileSkeleton } from "@/components/modules/(Profile)/Profile-Skeleton"
import { useProfile, useUserId } from "@/hooks"
import { AlertCircle } from "lucide-react"

export function ProfileView() {
  const userId = useUserId()
  const { data: profile, isLoading, isError } = useProfile(userId ?? "")

  if (isLoading) {
    return <ProfileSkeleton />
  }

  if (isError || !profile) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
        <AlertCircle className="h-5 w-5 shrink-0" />
        No se pudo cargar el perfil. Intenta recargar la página.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Mi Perfil</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Gestiona tu información personal y foto de perfil
        </p>
      </div>

      {/* Secciones - cada una es un form independiente */}
      <ProfileAvatar profile={profile} userId={userId!} />
      <ProfilePersonalInfo profile={profile} userId={userId!} />
      <ProfileAddress profile={profile} userId={userId!} />
    </div>
  )
}
