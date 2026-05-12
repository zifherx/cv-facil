import { AppError } from "@/shared/errors/App-Error"
import { mongoIdSchema } from "@/shared/schemas/shared.schema"
import { fail, ok } from "@/shared/types"
import { NextRequest, NextResponse } from "next/server"
import { conectarBD } from "../../../shared/lib/db"
import { CreateProfileUseCase } from "../application/CreateProfileUseCase"
import { GetProfileUseCase } from "../application/GetProfileUseCase"
import { UpdateAvatarUseCase } from "../application/UpdateAvatarUseCase"
import { UpdateProfileUseCase } from "../application/UpdateProfileUseCase"
import { MongoProfileRepository } from "../infrastructure/MongoProfileRepository"
import {
  createProfileSchema,
  updateAvatarSchema,
  updateProfileSchema,
} from "./validators/ProfileValidators"

const makeUseCases = () => {
  const repo = new MongoProfileRepository()
  return {
    getProfile: new GetProfileUseCase(repo),
    createProfile: new CreateProfileUseCase(repo),
    updateProfile: new UpdateProfileUseCase(repo),
    updateAvatar: new UpdateAvatarUseCase(repo),
    repo,
  }
}

const handleError = (err: unknown): NextResponse => {
  console.log("Err: ", err)
  if (err instanceof AppError) {
    return NextResponse.json(fail(err.code, err.message), {
      status: err.statusCode,
    })
  }
  console.error("[ProfileController]", err)
  return NextResponse.json(fail("INTERNAL_ERROR", "Unexpected server error"), {
    status: 500,
  })
}

function validateUserId(userId: string): NextResponse | null {
  const parsed = mongoIdSchema.safeParse(userId)
  if (!parsed.success) {
    return NextResponse.json(
      fail("INVALID_ID", parsed.error.issues[0].message),
      { status: 400 }
    )
  }
  return null
}

/**
 * POST /api/profile
 * Crea el perfil de un usuario (solo se puede crear 1 por usuario).
 */
export async function createProfileHandler(
  req: NextRequest
): Promise<NextResponse> {
  try {
    await conectarBD()
    const body = await req.json()
    console.log("Body:", body)
    const parsed = createProfileSchema.safeParse(body)
    console.log("Parsed:", parsed)
    if (!parsed.success) {
      return NextResponse.json(
        fail("VALIDATION_ERROR", parsed.error.issues[0].message),
        { status: 422 }
      )
    }
    const { createProfile } = makeUseCases()
    const profile = await createProfile.execute(parsed.data)
    return NextResponse.json(ok(profile), { status: 201 })
  } catch (err) {
    return handleError(err)
  }
}

/**
 * GET /api/profile/:userId
 * Obtiene el perfil completo de un usuario.
 */
export async function getProfileHandler(
  _req: NextRequest,
  userId: string
): Promise<NextResponse> {
  const idError = validateUserId(userId)
  if (idError) return idError

  try {
    await conectarBD()
    const { getProfile } = makeUseCases()
    const profile = await getProfile.execute(userId)
    return NextResponse.json(ok(profile))
  } catch (err) {
    return handleError(err)
  }
}

/**
 * PATCH /api/profile/:userId
 * Actualiza uno o más campos del perfil (firstName, lastName, email, phone, address).
 * Soporta actualización parcial — solo envía los campos que cambian.
 */
export async function updateProfileHandler(
  req: NextRequest,
  userId: string
): Promise<NextResponse> {
  const idError = validateUserId(userId)
  if (idError) return idError

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
    const { updateProfile } = makeUseCases()
    const profile = await updateProfile.execute(userId, parsed.data)
    return NextResponse.json(ok(profile))
  } catch (err) {
    return handleError(err)
  }
}

/**
 * PATCH /api/profile/:userId/avatar
 * Cambia o elimina el avatar.
 * Body: { avatarUrl: string } para cambiar | { avatarUrl: null } para eliminar
 */
export async function updateAvatarHandler(
  req: NextRequest,
  userId: string
): Promise<NextResponse> {
  const idError = validateUserId(userId)
  if (idError) return idError

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
    const { updateAvatar } = makeUseCases()
    const profile = await updateAvatar.execute({
      userId,
      avatarUrl: parsed.data.avatarUrl,
    })
    return NextResponse.json(ok(profile))
  } catch (err) {
    return handleError(err)
  }
}

/**
 * DELETE /api/profile/:userId
 * Elimina el perfil. Verifica existencia antes de eliminar y devuelve confirmación.
 */
export async function deleteProfileHandler(
  _req: NextRequest,
  userId: string
): Promise<NextResponse> {
  const idError = validateUserId(userId)
  if (idError) return idError

  try {
    await conectarBD()
    const { getProfile, repo } = makeUseCases()

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
    return handleError(err)
  }
}
