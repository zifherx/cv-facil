import {
  deleteSectionHandler,
  upsertSectionHandler,
} from "@/modules/cv/presentation"
import { PARAMS_CV_SECTION_ROUTE } from "@/shared/types"
import { NextRequest } from "next/server"

/**
 * PUT /api/cv/:cvId/sections/:sectionId
 * sectionId = "new"    → inserta una nueva sección
 * sectionId = ObjectId → actualiza la sección existente
 *
 * Body: { type, order, visible, data: { ...según type } }
 * Returns: CV completo actualizado (200) | 400 | 404 | 422 | 500
 */
export async function PUT(
  req: NextRequest,
  { params }: PARAMS_CV_SECTION_ROUTE
) {
  const { cvId, sectionId } = await params
  return upsertSectionHandler(req, cvId, sectionId)
}

/**
 * DELETE /api/cv/:cvId/sections/:sectionId
 * Returns: CV sin la sección eliminada (200) | 400 | 404 | 500
 */
export async function DELETE(
  req: NextRequest,
  { params }: PARAMS_CV_SECTION_ROUTE
) {
  const { cvId, sectionId } = await params
  return deleteSectionHandler(req, cvId, sectionId)
}
