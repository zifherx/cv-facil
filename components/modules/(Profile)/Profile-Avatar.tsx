"use client"

import { ProfileSectionCard } from "@/components/modules/(Profile)/Profile-Section-Card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useUpdateAvatar } from "@/hooks"
import { PROFILE_PROPS } from "@/types"
import { Camera, Loader2, Trash2 } from "lucide-react"
import { ChangeEvent, useRef } from "react"

export function ProfileAvatar({ profile, userId }: PROFILE_PROPS) {
  const inputRef = useRef<HTMLInputElement>(null)
  const { mutate: updateAvatar, isPending } = useUpdateAvatar(userId)

  const initials =
    `${profile.firstName[0] ?? ""}${profile.lastName[0] ?? ""}`.toUpperCase()

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const objectUrl = URL.createObjectURL(file)

    updateAvatar(
      { avatarUrl: objectUrl },
      { onSettled: () => URL.revokeObjectURL(objectUrl) }
    )
  }

  const handleRemove = () => {
    updateAvatar({ avatarUrl: null })
  }

  return (
    <ProfileSectionCard
      title="Foto de perfil"
      description="Utiliza una imagen de 600x600px o más para obtener mejores resultados."
    >
      <div className="flex items-start gap-5">
        {/* Avatar */}
        <div className="relative shrink-0">
          <Avatar className="h-20 w-20 ring-border ring-offset-2">
            <AvatarImage
              src={profile.avatarUrl ?? undefined}
              alt={`${profile.firstName} ${profile.lastName}`}
            />
            <AvatarFallback className="bg-[#FAECE7] text-lg font-semibold text-[#993C1D]">
              {initials}
            </AvatarFallback>
          </Avatar>

          {/* Overlay spinner mientras carga */}
          {isPending && (
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
              <Loader2 className="h-5 w-5 animate-spin text-white" />
            </div>
          )}
        </div>

        {/* Info + acciones */}
        <div className="space-y-1.5">
          <p className="text-sm font-medium">
            {profile.firstName} {profile.lastName}
          </p>

          <p className="text-xs text-muted-foreground">{profile.email}</p>

          <div className="flex items-center gap-2 pt-1">
            <input
              ref={inputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onCanPlay={handleFileChange}
            />

            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isPending}
              onClick={() => inputRef.current?.click()}
              className="h-8 gap-1.5 text-xs"
            >
              <Camera className="h-3.5 w-2.5" />
              Cambiar
            </Button>

            {profile.avatarUrl && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={isPending}
                onClick={handleRemove}
                className="h-8 gap-1.5 text-xs text-destructive hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Eliminar
              </Button>
            )}
          </div>

          <p className="text-[11px] text-muted-foreground/70">
            PNG,, JPG o WEBP · Máx. 5 MB
          </p>
        </div>
      </div>
    </ProfileSectionCard>
  )
}
