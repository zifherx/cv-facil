export function ComoFunciona() {
  return (
    <section id="how" className="px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-16 max-w-sm text-4xl tracking-tight text-[#1C1C1A] md:text-5xl">
          En tres pasos
        </h2>
        <div className="grid gap-12 md:grid-cols-3">
          {[
            {
              n: "01",
              t: "Crea tu cuenta",
              d: "Registro en 30 segundos. Solo nombre y email.",
            },
            {
              n: "02",
              t: "Rellena tu información",
              d: "Experiencia, habilidades, formación. Todo guiado.",
            },
            {
              n: "03",
              t: "Descarga tu CV",
              d: "PDF listo para enviar, con el diseño que elegiste.",
            },
          ].map((s) => (
            <div key={s.n} className="border-t border-[#E8E6DF] pt-8">
              <span className="font-['Instrument_Serif',serif] text-5xl font-light text-[#D3D1C7]">
                {s.n}
              </span>
              <h3 className="mt-4 font-['Inter',sans-serif] text-xl font-semibold text-[#1C1C1A]">
                {s.t}
              </h3>
              <p className="mt-2 font-['Inter',sans-serif] text-sm leading-relaxed text-[#5F5E5A]">
                {s.d}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
