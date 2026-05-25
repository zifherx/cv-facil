"use client"

import { ProfileSectionCard } from "@/components/modules/(Profile)/Profile-Section-Card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useUpdateProfile } from "@/hooks"
import { AddressFormValues, addressSchema } from "@/lib/validations"
import { PROFILE_PROPS } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, MapPin, Save } from "lucide-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"

const COUNTRIES = [
  { code: "PE", label: "Perú" },
  { code: "AR", label: "Argentina" },
  { code: "BO", label: "Bolivia" },
  { code: "BR", label: "Brasil" },
  { code: "CL", label: "Chile" },
  { code: "CO", label: "Colombia" },
  { code: "EC", label: "Ecuador" },
  { code: "MX", label: "México" },
  { code: "PY", label: "Paraguay" },
  { code: "UY", label: "Uruguay" },
  { code: "VE", label: "Venezuela" },
  { code: "ES", label: "España" },
  { code: "US", label: "Estados Unidos" },
  { code: "CA", label: "Canadá" },
] as const

export function ProfileAddress({ profile, userId }: PROFILE_PROPS) {
  const { mutate: updateProfile, isPending } = useUpdateProfile(userId)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      street: profile.address?.street ?? "",
      city: profile.address?.city ?? "",
      postalCode: profile.address?.postalCode ?? "",
      country: profile.address?.country ?? "",
    },
  })

  useEffect(() => {
    reset({
      street: profile.address?.street ?? "",
      city: profile.address?.city ?? "",
      postalCode: profile.address?.postalCode ?? "",
      country: profile.address?.country ?? "",
    })
  }, [profile, reset])

  const countryValue = watch("country")

  const onSubmit = (data: AddressFormValues) => {
    updateProfile({ address: data }, { onSuccess: () => reset(data) })
  }

  return (
    <ProfileSectionCard
      title="Dirección"
      description="Tu dirección de residencia. Aparecerá en los CVs que incluyan este dato."
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="space-y-4">
          {/* Calle */}
          <div className="space-y-1.5">
            <Label htmlFor="street" className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
              Calle
            </Label>
            <Input
              id="street"
              placeholder="Teodoro Valcarcel 657 dpto 404"
              autoComplete="street-address"
              {...register("street")}
            />
          </div>

          {/* Ciudad + Código postal */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="city">Ciudad</Label>
              <Input
                id="city"
                placeholder="Trujillo"
                autoComplete="address-level2"
                {...register("city")}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="postalCode">Código postal</Label>
              <Input
                id="postalCode"
                placeholder="13007"
                autoComplete="postal-code"
                {...register("postalCode")}
                className="max-w-32"
              />
            </div>
          </div>

          {/* País con Select */}
          <div className="space-y-1.5">
            <Label htmlFor="country">País</Label>
            <Select
              value={countryValue ?? ""}
              onValueChange={(val) =>
                setValue("country", val, { shouldDirty: true })
              }
            >
              <SelectTrigger id="country" className="w-full max-w-xs">
                <SelectValue placeholder="Selecciona tu país" />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.country && (
              <p className="text-xs text-destructive">
                {errors.country.message}
              </p>
            )}
          </div>

          {/* Footer */}
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
              {isPending ? "Guardando..." : "Guardar dirección"}
            </Button>
          </div>
        </div>
      </form>
    </ProfileSectionCard>
  )
}
