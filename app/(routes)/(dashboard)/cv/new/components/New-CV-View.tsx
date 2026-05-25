import { CVNewForm } from "@/components/modules/(New-CV)/CV-New-Form"

export function NewCVView() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Nuevo CV</h1>
        <p className="">Ponle un nombre y elige una plantilla para empezar</p>
      </div>

      {/* Form Card */}
      <div className="border-border-60 rounded-xl border bg-card p-6 shadow-sm">
        <CVNewForm />
      </div>
    </div>
  )
}
