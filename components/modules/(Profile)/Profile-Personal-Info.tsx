import { ProfileSectionCard } from "@/components/modules/(Profile)/Profile-Section-Card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useUpdateProfile } from "@/hooks"
import { ProfileFormValues, profileSchema } from "@/lib/validations"
import { PROFILE_PROPS } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Save } from "lucide-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"

export function ProfilePersonalInfo({ profile, userId }: PROFILE_PROPS) {
  const { mutate: updateProfile, isPending } = useUpdateProfile(userId)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: profile.firstName,
      lastName: profile.lastName,
      phone: profile.phone ?? "",
    },
  })

  useEffect(() => {
    reset({
      firstName: profile.firstName,
      lastName: profile.lastName,
      phone: profile.phone ?? "",
    })
  }, [profile, reset])

  const onSubmit = (data: ProfileFormValues) => {
    updateProfile(data, {
      onSuccess: () => reset(data),
    })
  }
  return (
    <ProfileSectionCard
      title="Información personal"
      description="Tu nombre y teléfono de contacto, El email se gestiona en Configuración de cuenta"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="space-y-4">
          {/* Nombre + Apellido en grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="firstName">
                Nombre <span className="text-destructive">*</span>
              </Label>
              <Input
                id="firstName"
                placeholder="Fernando"
                autoComplete="given-name"
                {...register("firstName")}
                className={
                  errors.firstName
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }
              />
              {errors.firstName && (
                <p className="text-xs text-destructive">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="lastName">
                Apellido <span className="text-destructive">*</span>
              </Label>
              <Input
                id="lastName"
                placeholder="Rojas Quezada"
                autoComplete="family-name"
                {...register("lastName")}
                className={
                  errors.lastName
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }
              />
              {errors.lastName && (
                <p className="text-xs text-destructive">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          {/* Teléfono */}
          <div className="space-y-1.5">
            <Label htmlFor="phone">Número de teléfono</Label>
            <Input
              id="phone"
              placeholder="+51 924 063 422"
              autoComplete="tel"
              {...register("phone")}
              className="max-w-xs"
            />
          </div>

          {/* Footer del form */}
          <div className="flex items-center justify-end border-t border-border/60 pt-4">
            <Button
              type="submit"
              size="sm"
              disabled={!isDirty || isPending}
              className="gap-1.5 bg-[#D85A30] text-white hover:bg-[#993C1D]"
            >
              {isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Save className="h-3.5 w-3.5" />
              )}
              {isPending ? "Guardando..." : "Guardar cambios"}
            </Button>
          </div>
        </div>
      </form>
    </ProfileSectionCard>
  )
}
