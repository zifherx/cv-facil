"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useChangeAccountEmail } from "@/hooks"
import { ChangeEmailFormValues, changeEmailSchema } from "@/lib/validations"
import { ACCOUNT_EMAIL_PROPS } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Pencil, X } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { AccountSectionCard } from "@/components/modules/(Account)/Account-Section-Card"

export function AccountEmail({ account, userId }: ACCOUNT_EMAIL_PROPS) {
  const [isEditing, setIsEditing] = useState(false)
  const {
    mutate: changeEmail,
    isPending,
    isError,
    error,
  } = useChangeAccountEmail(userId)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangeEmailFormValues>({
    resolver: zodResolver(changeEmailSchema),
    defaultValues: { newEmail: "" },
  })

  const handleCancel = () => {
    setIsEditing(false)
    reset()
  }

  const onSubmit = (data: ChangeEmailFormValues) => {
    changeEmail(data, {
      onSuccess: () => {
        setIsEditing(false)
        reset()
      },
    })
  }

  return (
    <AccountSectionCard
      title="Correo electrónico"
      description="Este es el email que usas para iniciar sesión en cvfácil."
    >
      {!isEditing ? (
        // ── Vista estática ────────────────────────────────────────────────────
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm">
              Tu dirección de correo electrónico es{" "}
              <strong className="font-semibold">{account.email}</strong>
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="gap-1.5 text-xs"
          >
            <Pencil className="h-3.5 w-3.5" />
            Cambiar correo electrónico
          </Button>
        </div>
      ) : (
        // ── Formulario inline ─────────────────────────────────────────────────
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-4">
            {/* Error global (ej: email ya en uso) */}
            {isError && (
              <div className="rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {(error as { message?: string })?.message ??
                  "No se pudo cambiar el email. Intenta de nuevo."}
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="newEmail">Nuevo correo electrónico</Label>
              <Input
                id="newEmail"
                type="email"
                autoComplete="email"
                placeholder="nuevo@email.com"
                autoFocus
                {...register("newEmail")}
                className={
                  errors.newEmail
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }
              />
              {errors.newEmail && (
                <p className="text-xs text-destructive">
                  {errors.newEmail.message}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="submit"
                size="sm"
                disabled={isPending}
                className="gap-1.5 bg-[#D85A30] text-white hover:bg-[#993C1D]"
              >
                {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {isPending ? "Guardando..." : "Guardar cambio"}
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
