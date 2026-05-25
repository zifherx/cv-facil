import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export function PanelIzquierdo() {
  return (
    <div className="relative hidden flex-col justify-between overflow-hidden bg-[#1C1C1A] p-12 lg:flex lg:w-[45%]">
      {/* Decoración de fondo */}
      <div className="absolute top-0 right-0 h-64 w-64 translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D85A30]/10" />
      <div className="absolute bottom-0 left-0 h-48 w-48 -translate-x-1/3 translate-y-1/3 rounded-full bg-[#D85A30]/8" />

      {/* Logo */}
      <Link
        href="/"
        className="inline-flex w-fit items-center gap-2 text-white/90 transition-colors hover:text-white"
      >
        <ArrowLeft size={16} className="text-white/50" />
        <span className="font-['Instrument_Serif',serif] text-xl font-semibold">
          cv<span className="text-[#D85A30]">fácil</span>
        </span>
      </Link>

      {/* Quote central */}
      <div className="relative z-10">
        <p className="mb-6 font-['Instrument_Serif',serif] text-4xl leading-snug text-white">
          &quot;El primer paso para conseguir ese trabajo es tener el CV
          correcto.&quot;
        </p>
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#D85A30] text-xs font-semibold text-white">
            A
          </div>
          <div>
            <p className="text-sm font-medium text-white/90">Ana Martínez</p>
            <p className="text-xs text-white/50">Reclutadora Senior, Lima</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="relative z-10 flex gap-8">
        {[
          ["12k+", "CVs creados"],
          ["95%", "Aprobación ATS"],
          ["5 min", "Tiempo promedio"],
        ].map(([n, l]) => (
          <div key={l}>
            <p className="text-2xl font-semibold text-white">{n}</p>
            <p className="mt-0.5 text-xs text-white/50">{l}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
