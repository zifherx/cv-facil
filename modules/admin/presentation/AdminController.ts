import { makeAdminUseCases } from "@/modules/admin/factories"
import {
  handleAdminError,
  requireAdmin,
  validateAdminUserId,
} from "@/modules/admin/helpers"
import { changeRoleSchema, listUsersSchema } from "@/modules/admin/presentation"
import { requireSession } from "@/shared/lib"
import { getMongoClient } from "@/shared/lib/mongo-client"
import { fail, ok } from "@/shared/types"
import { NextRequest, NextResponse } from "next/server"

/**
 * GET /api/admin/users?page=1&limit=20
 * Lista todos los usuarios paginados.
 */
export async function listUsersHandler(
  req: NextRequest
): Promise<NextResponse> {
  const { session, error } = await requireSession()
  if (error) return error
  const roleError = requireAdmin((session.user as { role?: string }).role)
  if (roleError) return roleError

  const { searchParams } = new URL(req.url)
  const parsed = listUsersSchema.safeParse({
    page: searchParams.get("page"),
    limit: searchParams.get("limit"),
  })
  if (!parsed.success) {
    return NextResponse.json(
      fail("VALIDATION_ERROR", parsed.error.issues[0].message),
      { status: 422 }
    )
  }

  try {
    const client = await getMongoClient()
    const { listUsers } = makeAdminUseCases(client)
    const result = await listUsers.execute(parsed.data.page, parsed.data.limit)
    return NextResponse.json(ok(result))
  } catch (err) {
    return handleAdminError(err)
  }
}

/**
 * GET /api/admin/users/:userId
 * Detalle de un usuario.
 */
export async function getAdminUserHandler(
  _req: NextRequest,
  userId: string
): Promise<NextResponse> {
  const { session, error } = await requireSession()
  if (error) return error

  const roleError = requireAdmin((session.user as { role?: string }).role)
  if (roleError) return roleError

  const idError = validateAdminUserId(userId)
  if (idError) return idError

  try {
    const client = await getMongoClient()
    const { getUser } = makeAdminUseCases(client)
    const user = await getUser.execute(userId)
    return NextResponse.json(ok(user))
  } catch (err) {
    return handleAdminError(err)
  }
}

/**
 * PATCH /api/admin/users/:userId/role
 * Cambia el rol de un usuario.
 * Body: { role: "user" | "admin" }
 */
export async function changeRoleHandler(
  req: NextRequest,
  userId: string
): Promise<NextResponse> {
  const { session, error } = await requireSession()
  if (error) return error

  const roleError = requireAdmin((session.user as { role?: string }).role)
  if (roleError) return roleError

  const idError = validateAdminUserId(userId)
  if (idError) return idError

  try {
    const body = await req.json()
    const parsed = changeRoleSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        fail("VALIDATION_ERROR", parsed.error.issues[0].message),
        { status: 422 }
      )
    }
    const client = await getMongoClient()
    const { changeRole } = makeAdminUseCases(client)
    const user = await changeRole.execute(userId, parsed.data, session.user.id)
    return NextResponse.json(ok(user))
  } catch (err) {
    return handleAdminError(err)
  }
}

/**
 * GET /api/admin/stats
 * Estadísticas generales de usuarios.
 */
export async function getUserStatsHandler(
  _req: NextRequest
): Promise<NextResponse> {
  const { session, error } = await requireSession()
  if (error) return error
  const roleError = requireAdmin((session.user as { role?: string }).role)
  if (roleError) return roleError

  try {
    const client = await getMongoClient()
    const { getStats } = makeAdminUseCases(client)
    const stats = await getStats.execute()
    return NextResponse.json(ok(stats))
  } catch (err) {
    return handleAdminError(err)
  }
}
