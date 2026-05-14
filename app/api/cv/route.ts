import { createCVHandler, listCVsHandler } from "@/modules/cv/presentation"
import { NextRequest } from "next/server"

/**
 * POST /api/cv
 * Body: { userId: string, title: string }
 * Returns: CV (201) con secciones por defecto | 422 | 500
 */
export async function POST(req: NextRequest) {
  return createCVHandler(req)
}

/**
 * GET /api/cv?userId=:userId
 * Returns: CV[] (200) ordenados por updatedAt desc | 400 | 500
 */
export async function GET(req: NextRequest) {
  return listCVsHandler(req)
}
