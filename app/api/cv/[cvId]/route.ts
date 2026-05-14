import {
  deleteCVHandler,
  getCVHandler,
  updateCVTitleHandler,
} from "@/modules/cv/presentation"
import { PARAMS_CV_ROUTE } from "@/shared/types"
import { NextRequest } from "next/server"

/**
 * GET /api/cv/:cvId
 * Returns: CV completo con secciones (200) | 400 | 404 | 500
 */
export async function GET(req: NextRequest, { params }: PARAMS_CV_ROUTE) {
  const { cvId } = await params
  return getCVHandler(req, cvId)
}

/**
 * PATCH /api/cv/:cvId
 * Body: { title: string }
 * Returns: CV actualizado (200) | 400 | 404 | 422 | 500
 */
export async function PATCH(req: NextRequest, { params }: PARAMS_CV_ROUTE) {
  const { cvId } = await params
  return updateCVTitleHandler(req, cvId)
}

/**
 * DELETE /api/cv/:cvId
 * Returns: { message, deleted: CV } (200) | 400 | 404 | 500
 */
export async function DELETE(req: NextRequest, { params }: PARAMS_CV_ROUTE) {
  const { cvId } = await params
  return deleteCVHandler(req, cvId)
}
