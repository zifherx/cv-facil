import { makeProfileUseCases } from "@/modules/profile/factories"
import {
  handleProfileError,
  validateProfileUserId,
} from "@/modules/profile/helpers"
import {
  createProfileSchema,
  updateAvatarSchema,
  updateProfileSchema,
} from "@/modules/profile/presentation"
import {
  conectarBD,
  ownerShipGuard,
  requireSession,
  withRateLimit,
} from "@/shared/lib"
import { fail, ok } from "@/shared/types"
import { NextRequest, NextResponse } from "next/server"

/**
 * POST /api/profile
 * Protección: session
 * Rate limit: mutation
 * Nota: userId viene del token de sesión, no del body — el cliente no puede
 *       crear un perfil para otro usuario.
 */
export async function createProfileHandler(
  req: NextRequest
): Promise<NextResponse> {
  const { session, error } = await requireSession()
  if (error) return error

  return withRateLimit(
    req,
    "mutation",
    async () => {
      try {
        await conectarBD()
        const body = await req.json()
        const parsed = createProfileSchema.safeParse({
          ...body,
          userId: session.user.id,
        })

        if (!parsed.success) {
          return NextResponse.json(
            fail("VALIDATION_ERROR", parsed.error.issues[0].message),
            { status: 422 }
          )
        }
        const { createProfile } = makeProfileUseCases()
        const profile = await createProfile.execute(parsed.data)
        return NextResponse.json(ok(profile), { status: 201 })
      } catch (err) {
        return handleProfileError(err)
      }
    },
    session.user.id
  )
}

/**
 * GET /api/profile/:userId
 * Protección: session + ownership
 * Rate limit: read
 */
export async function getProfileHandler(
  req: NextRequest,
  userId: string
): Promise<NextResponse> {
  const idError = validateProfileUserId(userId)
  if (idError) return idError

  const { session, error } = await requireSession()
  if (error) return error

  const ownerError = ownerShipGuard(userId, session.user.id)
  if (ownerError) return ownerError

  return withRateLimit(
    req,
    "read",
    async () => {
      try {
        await conectarBD()
        const { getProfile } = makeProfileUseCases()
        const profile = await getProfile.execute(userId)
        return NextResponse.json(ok(profile))
      } catch (err) {
        return handleProfileError(err)
      }
    },
    session.user.id
  )
}

/**
 * PATCH /api/profile/:userId
 * Actualiza uno o más campos del perfil (firstName, lastName, email, phone, address).
 * Soporta actualización parcial — solo envía los campos que cambian.
 * Protección: session + ownership
 * Rate limit: mutation
 */
export async function updateProfileHandler(
  req: NextRequest,
  userId: string
): Promise<NextResponse> {
  const idError = validateProfileUserId(userId)
  if (idError) return idError

  const { session, error } = await requireSession()
  if (error) return error

  const ownerError = ownerShipGuard(userId, session.user.id)
  if (ownerError) return ownerError

  return withRateLimit(
    req,
    "mutation",
    async () => {
      try {
        await conectarBD()
        const body = await req.json()
        const parsed = updateProfileSchema.safeParse(body)
        if (!parsed.success) {
          return NextResponse.json(
            fail("VALIDATION_ERROR", parsed.error.issues[0].message),
            { status: 422 }
          )
        }
        const { updateProfile } = makeProfileUseCases()
        const profile = await updateProfile.execute(userId, parsed.data)
        return NextResponse.json(ok(profile))
      } catch (err) {
        return handleProfileError(err)
      }
    },
    session.user.id
  )
}

/**
 * PATCH /api/profile/:userId/avatar
 * Cambia o elimina el avatar.
 * Body: { avatarUrl: string } para cambiar | { avatarUrl: null } para eliminar
 * Protección: session + ownership
 * Rate limit: mutation
 */
export async function updateAvatarHandler(
  req: NextRequest,
  userId: string
): Promise<NextResponse> {
  const idError = validateProfileUserId(userId)
  if (idError) return idError

  const { session, error } = await requireSession()
  if (error) return error

  const ownerError = ownerShipGuard(userId, session.user.id)
  if (ownerError) return ownerError

  return withRateLimit(
    req,
    "mutation",
    async () => {
      try {
        await conectarBD()
        const body = await req.json()
        const parsed = updateAvatarSchema.safeParse(body)
        if (!parsed.success) {
          return NextResponse.json(
            fail("VALIDATION_ERROR", parsed.error.issues[0].message),
            { status: 422 }
          )
        }
        const { updateAvatar } = makeProfileUseCases()
        const profile = await updateAvatar.execute({
          userId,
          avatarUrl: parsed.data.avatarUrl,
        })
        return NextResponse.json(ok(profile))
      } catch (err) {
        return handleProfileError(err)
      }
    },
    session.user.id
  )
}

/**
 * DELETE /api/profile/:userId
 * Elimina el perfil. Verifica existencia antes de eliminar y devuelve confirmación.
 * Protección: session + ownership
 * Rate limit: mutation
 */
export async function deleteProfileHandler(
  req: NextRequest,
  userId: string
): Promise<NextResponse> {
  const idError = validateProfileUserId(userId)
  if (idError) return idError

  const { session, error } = await requireSession()
  if (error) return error

  const ownerError = ownerShipGuard(userId, session.user.id)
  if (ownerError) return ownerError

  return withRateLimit(
    req,
    "mutation",
    async () => {
      try {
        await conectarBD()
        const { getProfile, repo } = makeProfileUseCases()
        // Verifica existencia — lanza ProfileNotFoundError si no existe
        const profile = await getProfile.execute(userId)
        await repo.delete(userId)

        return NextResponse.json(
          ok({
            message: `Perfil de '${profile.firstName} ${profile.lastName}' eliminado correctamente`,
            deleted: profile,
          })
        )
      } catch (err) {
        return handleProfileError(err)
      }
    },
    session.user.id
  )
}
