import { Button } from "@/components/ui/button"
import { FilePlus2 } from "lucide-react"
import Link from "next/link"

export function CVEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-muted/20 py-20 text-center">
      <div className="mb-5 rounded-full bg-muted p-5">
        <FilePlus2 className="h-9 w-9 text-muted-foreground" />
      </div>

      <h3 className="mb-1 text-base font-semibold text-foreground">
        Aún no tienes ningún CV
      </h3>
      <p className="mb-6 max-w-xs text-sm text-muted-foreground">
        Crea tu primer CV profesional en minutos. Elige una plantilla y
        personalízalo a tu medida.
      </p>

      <Button
        asChild
        className="gap-2 bg-[#D85A30] text-white hover:bg-[#993C1D]"
      >
        <Link href="/cv/new">
          <FilePlus2 className="h-4 w-4" />
          Crear mi primer CV
        </Link>
      </Button>
    </div>
  )
}
