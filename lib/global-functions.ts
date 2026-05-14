import { makeCVUseCases } from "@/modules/cv/factories"
import { fail } from "@/shared/types"
import { NextResponse } from "next/server"

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export const ownerShipGuard = (
  resourceUserId: string,
  sessionUserId: string
): NextResponse | null => {
  if (resourceUserId !== sessionUserId) {
    return NextResponse.json(
      fail("FORBIDDEN", "No tienes acceso a este recurso"),
      { status: 403 }
    )
  }
  return null
}

export const resolveCVWithOwnership = async (
  cvId: string,
  sessionUserId: string
) => {
  const { getCV } = makeCVUseCases()
  const cv = await getCV.execute(cvId)

  if (cv.userId !== sessionUserId) {
    return {
      cv: null,
      ownerError: NextResponse.json(
        fail("FORBIDDEN", "No tienes acceso a ete recurso"),
        { status: 403 }
      ),
    }
  }
  return { cv, ownerError: null }
}
