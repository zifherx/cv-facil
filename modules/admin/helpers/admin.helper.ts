import { AdminForbiddenError } from "@/modules/admin/domain"
import { AppError } from "@/shared/errors"
import { mongoIdSchema } from "@/shared/schemas"
import { fail } from "@/shared/types"
import { NextResponse } from "next/server"

export const handleAdminError = (err: unknown): NextResponse => {
  if (err instanceof AppError) {
    return NextResponse.json(fail(err.code, err.message), {
      status: err.statusCode,
    })
  }
  console.error("[AdminController]", err)
  return NextResponse.json(fail("INTERNAL_ERROR", "Unexpected server error"), {
    status: 500,
  })
}

export const validateAdminUserId = (id: string): NextResponse | null => {
  const parsed = mongoIdSchema.safeParse(id)
  if (!parsed.success) {
    return NextResponse.json(
      fail("INVALID_ID", parsed.error.issues[0].message),
      { status: 400 }
    )
  }
  return null
}

/**
 * Guard de rol — verifica que el usuario autenticado sea admin.
 * Úsalo después de requireSession():
 *
 *   const { session, error } = await requireSession()
 *   if (error) return error
 *   const roleError = requireAdmin(session.user.role)
 *   if (roleError) return roleError
 */
export const requireAdmin = (role: string | undefined): NextResponse | null => {
  if (role !== "admin") {
    const err = new AdminForbiddenError()
    return NextResponse.json(fail(err.code, err.message), {
      status: err.statusCode,
    })
  }
  return null
}
