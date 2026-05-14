import { updateDocumentConfigHandler } from "@/modules/cv/presentation"
import { PARAMS_CV_ROUTE } from "@/shared/types"
import { NextRequest } from "next/server"

/**
 * PATCH /api/cv/:cvId/config
 * Body: { templateId?, color?, fontFamily?, fontSize?, language? }
 * Returns: CV con config actualizada (200) | 400 | 404 | 422 | 500
 */
export async function PATCH(req: NextRequest, { params }: PARAMS_CV_ROUTE) {
  const { cvId } = await params
  return updateDocumentConfigHandler(req, cvId)
}
