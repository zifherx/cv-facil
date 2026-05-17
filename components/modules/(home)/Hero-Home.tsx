"use client"

import { ArrowRight, Zap } from "lucide-react"
import Link from "next/link"

export function HeroHome() {
  return (
    <section className="mx-auto max-w-6xl px-6 pt-40 pb-28">
      <div className="max-w-3xl">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#F5C4B3] bg-[#FAECE7] px-3 py-1.5 font-['Inter',sans-serif] text-xs text-[#D85A30]">
          <Zap size={12} />
          Crea tu CV en minutos, no en horas
        </div>

        <h1 className="mb-8 text-6xl leading-[1.05] tracking-tight text-[#1C1C1A] md:text-7xl">
          Tu CV, <em className="text-[#D85A30] not-italic">exactamente</em>
          <br />
          como lo imaginaste
        </h1>

        <p className="mb-12 max-w-xl font-['Inter',sans-serif] text-xl leading-relaxed text-[#5F5E5A]">
          Editor profesional con plantillas diseñadas por expertos, exportación
          en PDF y personalización total sin complicaciones.
        </p>

        <div className="flex flex-col items-start gap-4 sm:flex-row">
          <Link
            href="/auth/register"
            className="group inline-flex items-center gap-3 rounded-full bg-[#D85A30] px-8 py-4 font-['Inter',sans-serif] text-sm font-medium text-white transition-all hover:bg-[#993C1D]"
          >
            Crear mi CV gratis
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 rounded-full border border-[#E8E6DF] px-8 py-4 font-['Inter',sans-serif] text-sm text-[#5F5E5A] transition-all hover:border-[#D3D1C7] hover:bg-white"
          >
            Ver ejemplos
          </Link>
        </div>

        {/* Social proof */}
        <p className="mt-8 font-['Inter',sans-serif] text-xs text-[#888780]">
          Más de 12,000 profesionales ya crearon su CV con cv
          <span className="text-[#D85A30]">fácil</span>
        </p>
      </div>

      {/* Hero visual — CV preview cards */}
      <div className="relative mt-20 h-72 overflow-hidden rounded-2xl border border-[#E8E6DF] bg-white shadow-sm md:h-96">
        <div className="absolute inset-0 flex items-center justify-center gap-6 p-8">
          {/* Card 1 */}
          <div className="flex h-64 w-48 shrink-0 flex-col overflow-hidden rounded-xl bg-[#D85A30] shadow-lg">
            <div className="flex h-20 items-end bg-[#993C1D] p-4">
              <div className="space-y-1">
                <div className="h-2 w-24 rounded-full bg-white/80" />
                <div className="h-1.5 w-16 rounded-full bg-white/50" />
              </div>
            </div>
            <div className="flex-1 space-y-2 p-4">
              {[60, 80, 70, 50, 65].map((w, i) => (
                <div
                  key={i}
                  className={`h-1 rounded-full bg-white/30`}
                  style={{ width: `${w}%` }}
                />
              ))}
            </div>
          </div>
          {/* Card 2 — destacada */}
          <div className="z-10 -mt-4 flex h-72 w-52 shrink-0 flex-col overflow-hidden rounded-xl bg-[#1C1C1A] shadow-2xl">
            <div className="flex h-24 items-end bg-[#2C2C2A] p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 shrink-0 rounded-full bg-[#D85A30]" />
                <div className="space-y-1">
                  <div className="h-2 w-20 rounded-full bg-white/70" />
                  <div className="h-1.5 w-14 rounded-full bg-white/40" />
                </div>
              </div>
            </div>
            <div className="flex-1 space-y-2 p-4">
              {[75, 55, 85, 65, 70, 50].map((w, i) => (
                <div
                  key={i}
                  className="h-1 rounded-full bg-white/25"
                  style={{ width: `${w}%` }}
                />
              ))}
            </div>
          </div>
          {/* Card 3 */}
          <div className="flex h-64 w-48 shrink-0 flex-col overflow-hidden rounded-xl bg-[#E1F5EE] shadow-lg">
            <div className="flex h-20 items-end bg-[#1D9E75] p-4">
              <div className="space-y-1">
                <div className="h-2 w-24 rounded-full bg-white/80" />
                <div className="h-1.5 w-16 rounded-full bg-white/50" />
              </div>
            </div>
            <div className="flex-1 space-y-2 p-4">
              {[55, 75, 60, 80, 50].map((w, i) => (
                <div
                  key={i}
                  className="h-1 rounded-full bg-[#1D9E75]/30"
                  style={{ width: `${w}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
