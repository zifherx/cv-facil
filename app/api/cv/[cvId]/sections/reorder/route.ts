import { reorderSectionsHandler } from "@/modules/cv/presentation"
import { PARAMS_CV_ROUTE } from "@/shared/types"
import { NextRequest } from "next/server"

/**
 * PATCH /api/cv/:cvId/sections/reorder
 * Body: { orderedIds: string[] } — array completo de sectionIds en el nuevo orden.
 * Debe contener exactamente los mismos IDs que tiene el CV actualmente.
 * Returns: CV con secciones reordenadas (200) | 400 | 404 | 422 | 500
 */
export async function PATCH(req: NextRequest, { params }: PARAMS_CV_ROUTE) {
  const { cvId } = await params
  return reorderSectionsHandler(req, cvId)
}
