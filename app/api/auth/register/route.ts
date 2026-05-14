import { MongoAccountRepository } from "@/modules/account/infrastructure"
import { MongoProfileRepository } from "@/modules/profile/infrastructure"
import { auth, conectarBD, withRateLimit } from "@/shared/lib"
import { fail, ok } from "@/shared/types"
import { NextRequest, NextResponse } from "next/server"
import z from "zod"

const registerSchema = z.object({
  firstName: z.string().min(1, "El nombre es requerido").max(80).trim(),
  lastName: z.string().min(1, "El apellido es requerido").max(80).trim(),
  email: z.email("Email inválido"),
  password: z
    .string()
    .min(8, "Password mínimo 8 caracteres")
    .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
    .regex(/[0-9]/, "Debe contener al menos un número"),
})

export async function handleRegister(req: NextRequest) {
  try {
    await conectarBD()

    const body = await req.json()
    const parsed = registerSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        fail("VALIDATION_ERROR", parsed.error.issues[0].message),
        { status: 422 }
      )
    }

    const { firstName, lastName, email, password } = parsed.data

    const authResult = await auth.api.signUpEmail({
      body: { name: `${firstName} ${lastName}`, email, password },
    })

    if (!authResult?.user) {
      return NextResponse.json(
        fail("AUTH_ERROR", "Error al registrar en el sistema de autenticación"),
        { status: 400 }
      )
    }

    const betterAuthUserId = authResult.user.id

    const profileRepo = new MongoProfileRepository()
    await profileRepo.create({
      userId: betterAuthUserId,
      firstName,
      lastName,
      email,
    })

    const accountRepo = new MongoAccountRepository()
    await accountRepo.create({
      userId: betterAuthUserId,
      email,
    })

    return NextResponse.json(
      ok({
        message: "Usuario registrado correctamente",
        user: {
          id: betterAuthUserId,
          email: authResult.user.email,
          firstName,
          lastName,
        },
      }),
      { status: 201 }
    )
  } catch (err: unknown) {
    if (
      err !== null &&
      typeof err === "object" &&
      "body" in err &&
      typeof (err as { body?: unknown }).body === "object"
    ) {
      const body = (err as { body: { code?: string; message?: string } }).body

      if (
        body?.code === "USER_ALREADY_EXISTS" ||
        body?.code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL"
      ) {
        return NextResponse.json(
          fail("USER_ALREADY_EXISTS", "El email ya está registrado"),
          { status: 409 }
        )
      }

      if (body?.message) {
        return NextResponse.json(fail("AUTH_VALIDATION_ERROR", body.message), {
          status: 422,
        })
      }
    }

    console.error("[RegisterHandler]", err)
    return NextResponse.json(fail("INTERNAL_ERROR", "Error inesperado"), {
      status: 500,
    })
  }
}

// Rate limit: tier "auth" — 5 intentos / 15 min por IP
export async function POST(req: NextRequest) {
  return withRateLimit(req, "auth", () => handleRegister(req))
}
