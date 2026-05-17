import { queryKeys } from "@/hooks"
import { cvService } from "@/services"
import type {
  CreateCVDTO,
  ReorderSectionsDTO,
  UpdateCVTitleDTO,
  UpdateDocumentConfigDTO,
  UpsertSectionDTO,
} from "@/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

// ─── Queries ──────────────────────────────────────────────────────────────────

/** Lista de CVs del usuario autenticado */
export function useCVList() {
  return useQuery({
    queryKey: queryKeys.cv.lists(),
    queryFn: cvService.list,
    staleTime: 1000 * 30, // 30s — puede haber creaciones recientes
  })
}

/** CV individual completo con secciones */
export function useCV(cvId: string) {
  return useQuery({
    queryKey: queryKeys.cv.detail(cvId),
    queryFn: () => cvService.get(cvId),
    enabled: !!cvId,
    staleTime: 1000 * 10, // 10s — el builder edita en tiempo real
  })
}

// ─── CV Mutations ─────────────────────────────────────────────────────────────

export function useCreateCV() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateCVDTO) => cvService.create(data),
    onSuccess: (newCV) => {
      // Agregar el nuevo CV a la lista en caché sin refetch
      queryClient.setQueryData(queryKeys.cv.lists(), (old: unknown[]) =>
        old ? [newCV, ...old] : [newCV]
      )
      // Pre-popular el detalle para que la navegación al builder sea instantánea
      queryClient.setQueryData(queryKeys.cv.detail(newCV.id), newCV)
    },
  })
}

export function useUpdateCVTitle(cvId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateCVTitleDTO) => cvService.updateTitle(cvId, data),
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.cv.detail(cvId) })
      const previous = queryClient.getQueryData(queryKeys.cv.detail(cvId))
      queryClient.setQueryData(
        queryKeys.cv.detail(cvId),
        (old: typeof previous) => (old ? { ...old, title: newData.title } : old)
      )
      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.cv.detail(cvId), context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cv.detail(cvId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.cv.lists() })
    },
  })
}

export function useUpdateDocumentConfig(cvId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateDocumentConfigDTO) =>
      cvService.updateConfig(cvId, data),
    // Optimistic — el usuario ve el cambio de template/color al instante
    onMutate: async (newConfig) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.cv.detail(cvId) })
      const previous = queryClient.getQueryData(queryKeys.cv.detail(cvId))
      queryClient.setQueryData(
        queryKeys.cv.detail(cvId),
        (old: typeof previous) =>
          old
            ? {
                ...old,
                documentConfig: {
                  ...(old as { documentConfig: object }).documentConfig,
                  ...newConfig,
                },
              }
            : old
      )
      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.cv.detail(cvId), context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cv.detail(cvId) })
    },
  })
}

export function useDeleteCV() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (cvId: string) => cvService.delete(cvId),
    onSuccess: (_data, cvId) => {
      queryClient.removeQueries({ queryKey: queryKeys.cv.detail(cvId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.cv.lists() })
    },
  })
}

// ─── Section Mutations ────────────────────────────────────────────────────────

export function useUpsertSection(cvId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      sectionId,
      data,
    }: {
      sectionId: string
      data: UpsertSectionDTO
    }) => cvService.upsertSection(cvId, sectionId, data),
    onSuccess: (updatedCV) => {
      // El servidor devuelve el CV completo actualizado — actualizar directamente
      queryClient.setQueryData(queryKeys.cv.detail(cvId), updatedCV)
    },
  })
}

export function useDeleteSection(cvId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (sectionId: string) => cvService.deleteSection(cvId, sectionId),
    onSuccess: (updatedCV) => {
      queryClient.setQueryData(queryKeys.cv.detail(cvId), updatedCV)
    },
  })
}

export function useReorderSections(cvId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ReorderSectionsDTO) =>
      cvService.reorderSections(cvId, data),
    // Optimistic reorder — el drag&drop se ve fluido sin esperar al servidor
    onMutate: async ({ orderedIds }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.cv.detail(cvId) })
      const previous = queryClient.getQueryData(queryKeys.cv.detail(cvId))
      queryClient.setQueryData(
        queryKeys.cv.detail(cvId),
        (old: typeof previous) => {
          if (!old) return old
          const cv = old as { sections: { id: string; order: number }[] }
          const reordered = [...cv.sections]
            .sort((a, b) => orderedIds.indexOf(a.id) - orderedIds.indexOf(b.id))
            .map((s, i) => ({ ...s, order: i }))
          return { ...cv, sections: reordered }
        }
      )
      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.cv.detail(cvId), context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cv.detail(cvId) })
    },
  })
}
