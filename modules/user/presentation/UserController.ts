import { CreateUserUseCase } from "@/modules/user/application/CreateUserUseCase"
import { GetUserUseCase } from "@/modules/user/application/GetUserUseCase"
import { UpdateUserUseCase } from "@/modules/user/application/UpdateUserUseCase"
import { MongoUserRepository } from "@/modules/user/infrastructure/MongoUserRepository"
import {
  changeEmailSchema,
  changePasswordSchema,
  createUserSchema,
  getByEmailSchema,
} from "@/modules/user/presentation/validators/UserValidators"
import { AppError } from "@/shared/errors/App-Error"
import { conectarBD } from "@/shared/lib/db"
import { mongoIdSchema } from "@/shared/schemas/shared.schema"
import { fail, ok } from "@/shared/types"
import { NextRequest, NextResponse } from "next/server"

const makeUseCases = () => {
  const repo = new MongoUserRepository()
  return {
    createUser: new CreateUserUseCase(repo),
    getUser: new GetUserUseCase(repo),
    updateUser: new UpdateUserUseCase(repo),
    repo,
  }
}

const handleError = (err: unknown): NextResponse => {
  if (err instanceof AppError) {
    return NextResponse.json(fail(err.code, err.message), {
      status: err.statusCode,
    })
  }
  console.error("[UserController]", err)
  return NextResponse.json(fail("INTERNAL_ERROR", "Unexpected server error"), {
    status: 500,
  })
}

const validateMongoId = (id: string): NextResponse | null => {
  const parsed = mongoIdSchema.safeParse(id)
  if (!parsed.success) {
    return NextResponse.json(
      fail("INVALID_ID", parsed.error.issues[0].message),
      { status: 400 }
    )
  }
  return null
}

/** POST /api/users — create a new user */
export async function createUserHandler(
  req: NextRequest
): Promise<NextResponse> {
  try {
    await conectarBD()
    const body = await req.json()
    const parsed = createUserSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        fail("VALIDATION_ERROR", parsed.error.issues[0].message),
        { status: 422 }
      )
    }

    const { createUser } = makeUseCases()
    const user = await createUser.execute(parsed.data)
    return NextResponse.json(ok(user), { status: 201 })
  } catch (err) {
    return handleError(err)
  }
}

/** GET /api/users/[id] — get user by id */
export async function getUserByIdHandler(
  _req: NextRequest,
  id: string
): Promise<NextResponse> {
  const idError = validateMongoId(id)
  if (idError) return idError

  try {
    await conectarBD()
    const { getUser } = makeUseCases()
    const user = await getUser.execute({ by: "id", value: id })
    return NextResponse.json(ok(user))
  } catch (err) {
    return handleError(err)
  }
}

/** GET /api/users/by-email?email=xxx@yyy.com */
export async function getUserEmailHandler(
  req: NextRequest
): Promise<NextResponse> {
  const { searchParams } = new URL(req.url)
  const parsed = getByEmailSchema.safeParse({
    email: searchParams.get("email"),
  })

  if (!parsed.success) {
    return NextResponse.json(
      fail("VALIDATION_ERROR", parsed.error.issues[0].message),
      { status: 422 }
    )
  }

  try {
    await conectarBD()
    const { getUser } = makeUseCases()
    const user = await getUser.execute({
      by: "email",
      value: parsed.data.email,
    })
    return NextResponse.json(ok(user))
  } catch (err) {
    return handleError(err)
  }
}

/** PATCH /api/users/[id]/email — change email */
export async function changeEmailHandler(
  req: NextRequest,
  id: string
): Promise<NextResponse> {
  try {
    await conectarBD()
    const body = await req.json()
    const parsed = changeEmailSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        fail("VALIDATION_ERROR", parsed.error.issues[0].message),
        { status: 422 }
      )
    }
    const { updateUser } = makeUseCases()
    const user = await updateUser.execute({
      operation: "change-email",
      userId: id,
      ...parsed.data,
    })
    return NextResponse.json(ok(user))
  } catch (err) {
    return handleError(err)
  }
}

/** PATCH /api/users/[id]/password — change password */
export async function changePasswordHandler(
  req: NextRequest,
  id: string
): Promise<NextResponse> {
  const idError = validateMongoId(id)
  if (idError) return idError

  try {
    await conectarBD()
    const body = await req.json()
    const parsed = changePasswordSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        fail("VALIDATION_ERROR", parsed.error.issues[0].message),
        { status: 422 }
      )
    }
    const { updateUser } = makeUseCases()
    const user = await updateUser.execute({
      operation: "change-password",
      userId: id,
      ...parsed.data,
    })
    return NextResponse.json(ok(user))
  } catch (err) {
    return handleError(err)
  }
}

/** DELETE /api/users/[id] — delete user */
export async function deleteUserHandler(
  _req: NextRequest,
  id: string
): Promise<NextResponse> {
  const idError = validateMongoId(id)
  if (idError) {
    return idError
  }

  try {
    await conectarBD()
    const { getUser, repo } = makeUseCases()

    const user = await getUser.execute({ by: "id", value: id })
    await repo.delete(id)
    return NextResponse.json(
      ok({
        message: `Usuario ${user.email} eliminado correctamente.`,
        deleted: user,
      })
    )
  } catch (err) {
    return handleError(err)
  }
}
