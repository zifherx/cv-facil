"use client"

import { useSignIn } from "@/hooks/auth/use-auth"
import { LoginFormValues, loginSchema } from "@/lib/validations"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"

export function PanelDerecho() {
  const [showPassword, setShowPassword] = useState(false)
  const { mutate: signIn, isPending, error } = useSignIn()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = (data: LoginFormValues) => {
    signIn({ email: data.email, password: data.password })
  }

  return (
    <div className="flex flex-1 flex-col justify-center bg-[#FAFAF8] px-6 sm:px-12 lg:px-16">
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
            Bienvenido de nuevo
          </h1>
          <p className="text-sm text-[#5F5E5A]">
            Ingresa a tu cuenta para continuar
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
          noValidate
        >
          {/* Error global */}
          {error && (
            <div className="rounded-lg border border-[#F5C4B3] bg-[#FAECE7] px-4 py-3 text-sm text-[#993C1D]">
              {(error as { message?: string })?.message ??
                "Credenciales incorrectas"}
            </div>
          )}

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
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-[#1C1C1A]">
                Contraseña
              </label>
              <a
                href="#"
                className="text-xs text-[#D85A30] transition-colors hover:text-[#993C1D]"
              >
                ¿La olvidaste?
              </a>
            </div>
            <div className="relative">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full rounded-xl border border-[#E8E6DF] bg-white px-4 py-3 pr-12 text-sm text-[#1C1C1A] placeholder-[#B4B2A9] transition-all focus:border-[#D85A30] focus:ring-2 focus:ring-[#D85A30]/30 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute top-1/2 right-4 -translate-y-1/2 text-[#888780] transition-colors hover:text-[#5F5E5A]"
                aria-label={
                  showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-[#993C1D]">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1C1C1A] py-3.5 text-sm font-medium text-white transition-colors hover:bg-[#D85A30] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Ingresando...
              </>
            ) : (
              "Ingresar"
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-[#5F5E5A]">
          ¿No tienes cuenta?{" "}
          <Link
            href="/auth/register"
            className="font-medium text-[#D85A30] transition-colors hover:text-[#993C1D]"
          >
            Créala gratis
          </Link>
        </p>
      </div>
    </div>
  )
}
