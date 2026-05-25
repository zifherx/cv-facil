import { AppError } from "@/shared/errors"
import { mongoIdSchema } from "@/shared/schemas"
import { fail } from "@/shared/types"
import { NextResponse } from "next/server"

export const handleAccountError = (err: unknown): NextResponse => {
  if (err instanceof AppError) {
    return NextResponse.json(fail(err.code, err.message), {
      status: err.statusCode,
    })
  }
  console.error("[AccountController]", err)
  return NextResponse.json(fail("INTERNAL_ERROR", "Unexpected server error"), {
    status: 500,
  })
}

export const validateAccountUserId = (userId: string): NextResponse | null => {
  const parsed = mongoIdSchema.safeParse(userId)
  if (!parsed.success) {
    return NextResponse.json(
      fail("INVALID_ID", parsed.error.issues[0].message),
      { status: 400 }
    )
  }
  return null
}
