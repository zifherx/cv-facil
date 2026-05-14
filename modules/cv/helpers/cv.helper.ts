import { AppError } from "@/shared/errors"
import { mongoIdSchema } from "@/shared/schemas"
import { fail } from "@/shared/types"
import { NextResponse } from "next/server"

export const handleCVError = (err: unknown): NextResponse => {
  if (err instanceof AppError) {
    return NextResponse.json(fail(err.code, err.message), {
      status: err.statusCode,
    })
  }
  console.error("[CVController]", err)
  return NextResponse.json(fail("INTERNAL_ERROR", "Unexpected server error"), {
    status: 500,
  })
}

export const validateCVId = (cvId: string): NextResponse | null => {
  const parsed = mongoIdSchema.safeParse(cvId)
  if (!parsed.success) {
    return NextResponse.json(
      fail("INVALID_ID", parsed.error.issues[0].message),
      { status: 400 }
    )
  }
  return null
}

/**
 * sectionId puede ser un ObjectId normal o el valor especial "new".
 * "new" es válido — indica al repositorio que debe insertar una sección.
 */
export const validateSectionId = (sectionId: string): NextResponse | null => {
  if (sectionId === "new") return null
  const parsed = mongoIdSchema.safeParse(sectionId)
  if (!parsed.success) {
    return NextResponse.json(
      fail("INVALID_SECTION_ID", parsed.error.issues[0].message),
      { status: 400 }
    )
  }
  return null
}
