"use client"

import TemplateMiniCard from "@/components/shared/Template-Mini-Card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCreateCV } from "@/hooks"
import { cn } from "@/lib"
import { TEMPLATES_CV } from "@/lib/constants"
import { CreateCVFormValues, createCVSchema } from "@/lib/validations"
import { TemplateId } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"

export function CVNewForm() {
  const router = useRouter()
  const { mutate: createCV, isPending } = useCreateCV()
  const [templateSeleccionado, setTemplateSeleccionado] =
    useState<TemplateId>("erasmus")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCVFormValues>({
    resolver: zodResolver(createCVSchema),
    defaultValues: { title: "" },
  })

  const onSubmit = (data: CreateCVFormValues) => {
    createCV(
      { title: data.title },
      {
        onSuccess: (cv) => {
          // Navegar al builder con el CV recién creado
          router.push(`/builder/${cv.id}`)
        },
      }
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">
      {/* Título del CV */}
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-medium">
          Nombre de tu CV <span className="text-destructive">*</span>
        </Label>
        <Input
          id="title"
          placeholder="Ej: CV Senior Developer 2026"
          autoFocus
          autoComplete="off"
          {...register("title")}
          className={cn(
            "h-11",
            errors.title && "border-destructive focus-visible:ring-destructive"
          )}
        />
        {errors.title ? (
          <p className="text-xs text-destructive">{errors.title.message}</p>
        ) : (
          <p className="text-xs text-muted-foreground">
            Puedes cambiarlo en cualquier momento desde el editor.
          </p>
        )}
      </div>

      {/* Selector de plantilla */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Elige una plantilla</Label>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
          {TEMPLATES_CV.map((t) => (
            <TemplateMiniCard
              key={t.id}
              template={t}
              selected={templateSeleccionado === t.id}
              onSelect={() => setTemplateSeleccionado(t.id as TemplateId)}
            />
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Podrás cambiar la plantilla, colores y fuente desde el editor.
        </p>
      </div>

      {/* Submit */}
      <div className="flex items-center justify-end gap-3 border-t border-border/60 pt-6">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isPending}
          onClick={() => router.back()}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          size="sm"
          disabled={isPending}
          className="gap-2 bg-[#D85A30] text-white hover:bg-[#993C1D]"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          {isPending ? "Creando..." : "Crear CV"}
        </Button>
      </div>
    </form>
  )
}
