import { Download, FileText, Palette } from "lucide-react"

export function Features() {
  return (
    <section
      id="features"
      className="border-y border-[#E8E6DF] bg-white px-6 py-28"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-16">
          <h2 className="mb-4 text-4xl tracking-tight text-[#1C1C1A] md:text-5xl">
            Todo lo que necesitas
            <br />
            para destacar
          </h2>
          <p className="max-w-md font-['Inter',sans-serif] text-lg text-[#5F5E5A]">
            Diseñado para que te concentres en tu contenido, no en el formato.
          </p>
        </div>

        <div className="grid gap-px bg-[#E8E6DF] md:grid-cols-3">
          {[
            {
              icon: <Palette size={20} className="text-[#D85A30]" />,
              title: "Plantillas profesionales",
              desc: "5 plantillas diseñadas por expertos en recursos humanos. Únicas, limpias, efectivas.",
            },
            {
              icon: <FileText size={20} className="text-[#D85A30]" />,
              title: "Editor en tiempo real",
              desc: "Edita y ve los cambios al instante. Sin recargar, sin esperar.",
            },
            {
              icon: <Download size={20} className="text-[#D85A30]" />,
              title: "Exportación perfecta",
              desc: "PDF de alta calidad con tipografía y márgenes exactos, listos para enviar.",
            },
          ].map((f) => (
            <div key={f.title} className="bg-white p-10">
              <div className="mb-4">{f.icon}</div>
              <h3 className="mb-3 font-['Inter',sans-serif] text-xl font-semibold text-[#1C1C1A]">
                {f.title}
              </h3>
              <p className="font-['Inter',sans-serif] text-sm leading-relaxed text-[#5F5E5A]">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
