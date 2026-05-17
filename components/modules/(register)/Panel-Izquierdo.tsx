import { ArrowLeft, Check } from "lucide-react"
import Link from "next/link"

export function PanelIzquierdo() {
  return (
    <div className="relative hidden flex-col justify-between overflow-hidden bg-[#D85A30] p-12 lg:flex lg:w-[42%]">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-12 right-8 h-48 w-48 rounded-full border-2 border-white" />
        <div className="absolute bottom-24 left-4 h-32 w-32 rounded-full border border-white" />
        <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white" />
      </div>

      <Link
        href="/"
        className="relative z-10 inline-flex w-fit items-center gap-2 text-white/90 transition-colors hover:text-white"
      >
        <ArrowLeft size={16} className="text-white/70" />
        <span className="font-['Instrument_Serif',serif] text-xl font-semibold">
          cvfácil
        </span>
      </Link>

      <div className="relative z-10 space-y-6">
        <h2 className="font-['Instrument_Serif',serif] text-4xl leading-snug text-white">
          Tu próxima oportunidad
          <br />
          empieza aquí
        </h2>
        <div className="space-y-3">
          {[
            "Plantillas aprobadas por recruiters",
            "Editor visual sin curva de aprendizaje",
            "Exportación PDF de alta calidad",
            "100% gratis para empezar",
          ].map((item) => (
            <div key={item} className="flex items-center gap-3">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20">
                <Check size={11} className="text-white" />
              </div>
              <span className="text-sm text-white/90">{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 text-xs text-white/40">
        Más de 12,000 profesionales confían en cvfácil
      </div>
    </div>
  )
}
