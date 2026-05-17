import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function CTA() {
  return (
    <section className="bg-[#1C1C1A] px-6 py-28">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="mb-6 text-5xl tracking-tight text-[#FAFAF8] md:text-6xl">
          Empieza hoy,
          <br />
          <em className="text-[#D85A30] not-italic">gratis</em>
        </h2>
        <p className="mb-10 font-['Inter',sans-serif] text-lg text-[#888780]">
          Sin tarjeta de crédito. Sin compromisos.
        </p>
        <Link
          href="/auth/register"
          className="group inline-flex items-center gap-3 rounded-full bg-[#D85A30] px-10 py-4 font-['Inter',sans-serif] text-sm font-medium text-white transition-all hover:bg-[#993C1D]"
        >
          Crear mi CV gratis
          <ArrowRight
            size={16}
            className="transition-transform group-hover:translate-x-1"
          />
        </Link>
      </div>
    </section>
  )
}
