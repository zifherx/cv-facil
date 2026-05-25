import { AccountSectionCard } from "@/components/modules/(Account)/Account-Section-Card"
import { PasswordInput } from "@/components/shared/Password-Input"
import { Button } from "@/components/ui/button"
import { getStrength } from "@/lib"
import {
  changePasswordSchema,
  ChangePassworFormValues,
} from "@/lib/validations"
import { authClient } from "@/shared/lib/auth-client"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Pencil, X } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"

export function AccountPassword() {
  const [isEditing, setIsEditing] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ChangePassworFormValues>({
    resolver: zodResolver(changePasswordSchema),
  })

  const newPwd = watch("newPassword", "")
  const strength = getStrength(newPwd)

  const handleCancel = () => {
    setIsEditing(false)
    setServerError(null)
    reset()
  }

  const onSubmit = async (data: ChangePassworFormValues) => {
    setIsPending(true)
    setServerError(null)
    try {
      await authClient.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      })
      handleCancel()
    } catch (err) {
      setServerError(
        (err as { message?: string })?.message ??
          "No se pudo cambiar la contraseña. Verifica tu contraseña actual."
      )
    } finally {
      setIsPending(false)
    }
  }

  return (
    <AccountSectionCard
      title="Contraseña"
      description="Usa una contraseña segura que no uses en otros sitios."
    >
      {!isEditing ? (
        // ── Vista estática ────────────────────────────────────────────────────
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">••••••••••••</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="gap-1.5 text-xs"
          >
            <Pencil className="h-3.5 w-3.5" />
            Cambiar contraseña
          </Button>
        </div>
      ) : (
        // ── Formulario inline ─────────────────────────────────────────────────
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-4">
            {serverError && (
              <div className="rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {serverError}
              </div>
            )}

            <PasswordInput
              id="currentPassword"
              label="Contraseña actual"
              registration={register("currentPassword")}
              error={errors.currentPassword?.message}
            />

            <div>
              <PasswordInput
                id="newPassword"
                label="Nueva contraseña"
                placeholder="Mínimo 8 caracteres"
                registration={register("newPassword")}
                error={errors.newPassword?.message}
              />
              {/* Barra de fortaleza */}
              {newPwd && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="h-1 flex-1 rounded-full transition-all duration-300"
                        style={{
                          backgroundColor:
                            i <= strength.score ? strength.color : "#E8E6DF",
                        }}
                      />
                    ))}
                  </div>
                  {strength.label && (
                    <p className="text-xs" style={{ color: strength.color }}>
                      {strength.label}
                    </p>
                  )}
                </div>
              )}
            </div>

            <PasswordInput
              id="confirmPassword"
              label="Confirmar nueva contraseña"
              registration={register("confirmPassword")}
              error={errors.confirmPassword?.message}
            />

            <div className="flex items-center gap-2 border-t border-border/60 pt-4">
              <Button
                type="submit"
                size="sm"
                disabled={isPending}
                className="gap-1.5 bg-[#D85A30] text-white hover:bg-[#993C1D]"
              >
                {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {isPending ? "Guardando..." : "Cambiar contraseña"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={isPending}
                onClick={handleCancel}
                className="gap-1.5 text-muted-foreground"
              >
                <X className="h-3.5 w-3.5" />
                Cancelar
              </Button>
            </div>
          </div>
        </form>
      )}
    </AccountSectionCard>
  )
}
