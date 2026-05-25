"use client"

import { useRegister } from "@/hooks"
import { getStrength } from "@/lib"
import { RegisterFormValues, registerSchema } from "@/lib/validations"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"

export function PanelDerecho() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const { mutate: registerUser, isPending, error } = useRegister()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  })

  const password = watch("password", "")
  const strength = getStrength(password)

  const onSubmit = (data: RegisterFormValues) => {
    registerUser({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
    })
  }

  return (
    <div className="flex flex-1 flex-col justify-center overflow-y-auto bg-[#FAFAF8] px-6 py-12 sm:px-12 lg:px-16">
      <div className="mx-auto w-full max-w-sm">
        {/* Mobile logo */}
        <Link
          href="/"
          className="mb-10 inline-flex items-center gap-2 text-[#1C1C1A] lg:hidden"
        >
          <span className="font-['Instrument_Serif',serif] text-xl font-semibold">
            cv<span className="text-[#D85A30]">fácil</span>
          </span>
        </Link>

        <div className="mb-8">
          <h1 className="mb-1 font-['Instrument_Serif',serif] text-3xl text-[#1C1C1A]">
            Crea tu cuenta
          </h1>
          <p className="text-sm text-[#5F5E5A]">
            Gratis, sin tarjeta de crédito
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          {error && (
            <div className="rounded-lg border border-[#F5C4B3] bg-[#FAECE7] px-4 py-3 text-sm text-[#993C1D]">
              {(error as { message?: string })?.message ??
                "Error al registrar. Intenta de nuevo."}
            </div>
          )}

          {/* Nombre + Apellido */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#1C1C1A]">
                Nombre
              </label>
              <input
                {...register("firstName")}
                type="text"
                autoComplete="given-name"
                placeholder="Fernando"
                className="w-full rounded-xl border border-[#E8E6DF] bg-white px-3 py-3 text-sm text-[#1C1C1A] placeholder-[#B4B2A9] transition-all focus:border-[#D85A30] focus:ring-2 focus:ring-[#D85A30]/30 focus:outline-none"
              />
              {errors.firstName && (
                <p className="text-xs text-[#993C1D]">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#1C1C1A]">
                Apellido
              </label>
              <input
                {...register("lastName")}
                type="text"
                autoComplete="family-name"
                placeholder="Rojas"
                className="w-full rounded-xl border border-[#E8E6DF] bg-white px-3 py-3 text-sm text-[#1C1C1A] placeholder-[#B4B2A9] transition-all focus:border-[#D85A30] focus:ring-2 focus:ring-[#D85A30]/30 focus:outline-none"
              />
              {errors.lastName && (
                <p className="text-xs text-[#993C1D]">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#1C1C1A]">
              Correo electrónico
            </label>
            <input
              {...register("email")}
              type="email"
              autoComplete="email"
              placeholder="tu@email.com"
              className="w-full rounded-xl border border-[#E8E6DF] bg-white px-4 py-3 text-sm text-[#1C1C1A] placeholder-[#B4B2A9] transition-all focus:border-[#D85A30] focus:ring-2 focus:ring-[#D85A30]/30 focus:outline-none"
            />
            {errors.email && (
              <p className="text-xs text-[#993C1D]">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#1C1C1A]">
              Contraseña
            </label>
            <div className="relative">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Mínimo 8 caracteres"
                className="w-full rounded-xl border border-[#E8E6DF] bg-white px-4 py-3 pr-12 text-sm text-[#1C1C1A] placeholder-[#B4B2A9] transition-all focus:border-[#D85A30] focus:ring-2 focus:ring-[#D85A30]/30 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute top-1/2 right-4 -translate-y-1/2 text-[#888780] transition-colors hover:text-[#5F5E5A]"
                aria-label={showPassword ? "Ocultar" : "Mostrar"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Password strength bar */}
            {password && (
              <div className="space-y-1 pt-0.5">
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

            {errors.password && (
              <p className="text-xs text-[#993C1D]">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm password */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#1C1C1A]">
              Confirmar contraseña
            </label>
            <div className="relative">
              <input
                {...register("confirmPassword")}
                type={showConfirm ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Repite tu contraseña"
                className="w-full rounded-xl border border-[#E8E6DF] bg-white px-4 py-3 pr-12 text-sm text-[#1C1C1A] placeholder-[#B4B2A9] transition-all focus:border-[#D85A30] focus:ring-2 focus:ring-[#D85A30]/30 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((p) => !p)}
                className="absolute top-1/2 right-4 -translate-y-1/2 text-[#888780] transition-colors hover:text-[#5F5E5A]"
                aria-label={showConfirm ? "Ocultar" : "Mostrar"}
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-[#993C1D]">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#D85A30] py-3.5 text-sm font-medium text-white transition-colors hover:bg-[#993C1D] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Creando tu cuenta...
              </>
            ) : (
              "Crear cuenta gratis"
            )}
          </button>

          <p className="text-center text-xs leading-relaxed text-[#888780]">
            Al registrarte, aceptas nuestros{" "}
            <a
              href="#"
              className="text-[#5F5E5A] underline hover:text-[#1C1C1A]"
            >
              Términos de servicio
            </a>{" "}
            y{" "}
            <a
              href="#"
              className="text-[#5F5E5A] underline hover:text-[#1C1C1A]"
            >
              Política de privacidad
            </a>
          </p>
        </form>

        <p className="mt-6 text-center text-sm text-[#5F5E5A]">
          ¿Ya tienes cuenta?{" "}
          <Link
            href="/auth/login"
            className="font-medium text-[#D85A30] transition-colors hover:text-[#993C1D]"
          >
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
