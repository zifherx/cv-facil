"use client"

import { CVCard } from "@/components/modules/(CV)/CV-Card"
import { CVDeleteDialog } from "@/components/modules/(CV)/CV-Delete-Dialog"
import { CVEmptyState } from "@/components/modules/(CV)/CV-Empty-State"
import { CVListSkeleton } from "@/components/modules/(CV)/CV-List-Skeleton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCVList } from "@/hooks"
import { CV } from "@/types"
import { Plus, Search } from "lucide-react"
import Link from "next/link"
import { useMemo, useState } from "react"

export function CVListView() {
  const { data: cvs, isLoading, isError } = useCVList()
  const [search, setSearch] = useState("")
  const [toDelete, setToDelete] = useState<CV | null>(null)

  const filtered = useMemo(() => {
    if (!cvs) return []
    if (!search.trim()) return cvs
    return cvs.filter((cv) =>
      cv.title.toLowerCase().includes(search.toLowerCase())
    )
  }, [cvs, search])

  if (isLoading) return <CVListSkeleton />

  if (isError) {
    return (
      <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
        No se pudieron cargar tus CVs. Intenta recargar la página.
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6">
        {/* ── Page header ───────────────────────────────────────────────── */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Mis CVs</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {cvs?.length
                ? `${cvs.length} CV${cvs.length > 1 ? "s" : ""} creado${cvs.length > 1 ? "s" : ""}`
                : "Aún no tienes CVs"}
            </p>
          </div>

          <Button
            asChild
            size="sm"
            className="w-fit gap-2 bg-[#D85A30] text-white hover:bg-[#993C1D]"
          >
            <Link href="/cv/new">
              <Plus className="h-4 w-4" />
              Nuevo CV
            </Link>
          </Button>
        </div>

        {/* ── Content ───────────────────────────────────────────────────── */}
        {!cvs?.length ? (
          <CVEmptyState />
        ) : (
          <>
            {/* Search — solo si tiene más de 3 CVs */}
            {cvs.length > 3 && (
              <div className="relative max-w-sm">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por título..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            )}

            {/* Grid de CVs */}
            {filtered.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((cv) => (
                  <CVCard key={cv.id} cv={cv} onDelete={setToDelete} />
                ))}
              </div>
            ) : (
              // Sin resultados de búsqueda
              <div className="rounded-xl border border-dashed border-border/60 py-16 text-center">
                <p className="text-sm text-muted-foreground">
                  No se encontraron CVs con &quot;{search}&quot;
                </p>
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="mt-2 text-xs text-[#D85A30] hover:underline"
                >
                  Limpiar búsqueda
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete confirmation dialog */}
      <CVDeleteDialog cv={toDelete} onClose={() => setToDelete(null)} />
    </>
  )
}
