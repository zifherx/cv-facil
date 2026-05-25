import { makeAccountUseCases } from "@/modules/account/factories"
import {
  handleAccountError,
  validateAccountUserId,
} from "@/modules/account/helpers"
import {
  changeAccountEmailSchema,
  createAccountSchema,
  updateNotificationPrefsSchema,
} from "@/modules/account/presentation"
import {
  conectarBD,
  ownerShipGuard,
  requireSession,
  withRateLimit,
} from "@/shared/lib"
import { fail, ok } from "@/shared/types"
import { NextRequest, NextResponse } from "next/server"

// ─── Handlers ─────────────────────────────────────────────────────────────────

/**
 * POST /api/account
 * Crea la cuenta de configuración de un usuario (1 por usuario).
 * Se crea automáticamente al registrar un usuario — también expuesto como endpoint.
 * Protección: session
 * Rate limit: mutation
 * userId se toma del token — el cliente no puede crear una cuenta para otro usuario.
 */
export async function createAccountHandler(
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
        const parsed = createAccountSchema.safeParse({
          ...body,
          userId: session.user.id,
        })
        if (!parsed.success) {
          return NextResponse.json(
            fail("VALIDATION_ERROR", parsed.error.issues[0].message),
            { status: 422 }
          )
        }
        const { createAccount } = makeAccountUseCases()
        const account = await createAccount.execute(parsed.data)
        return NextResponse.json(ok(account), { status: 201 })
      } catch (err) {
        return handleAccountError(err)
      }
    },
    session.user.id
  )
}

/**
 * GET /api/account/:userId
 * Obtiene la configuración de cuenta de un usuario.
 * Protección: session + ownership
 * Rate limit: read
 */
export async function getAccountHandler(
  req: NextRequest,
  userId: string
): Promise<NextResponse> {
  const idError = validateAccountUserId(userId)
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
        const { getAccount } = makeAccountUseCases()
        const account = await getAccount.execute(userId)
        return NextResponse.json(ok(account))
      } catch (err) {
        return handleAccountError(err)
      }
    },
    session.user.id
  )
}

/**
 * PATCH /api/account/:userId/email
 * Cambia el email de autenticación.
 * Body: { newEmail: string }
 * Nota: la verificación de contraseña actual se delega al módulo users
 *       (el cliente llama primero a PATCH /api/users/:id/email y luego a este endpoint).
 * Protección: session + ownership
 * Rate limit: mutation
 */
export async function changeAccountEmailHandler(
  req: NextRequest,
  userId: string
): Promise<NextResponse> {
  const idError = validateAccountUserId(userId)
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
        const parsed = changeAccountEmailSchema.safeParse(body)
        if (!parsed.success) {
          return NextResponse.json(
            fail("VALIDATION_ERROR", parsed.error.issues[0].message),
            { status: 422 }
          )
        }
        const { changeEmail } = makeAccountUseCases()
        const account = await changeEmail.execute(userId, parsed.data)
        return NextResponse.json(ok(account))
      } catch (err) {
        return handleAccountError(err)
      }
    },
    session.user.id
  )
}

/**
 * PATCH /api/account/:userId/notifications
 * Actualiza parcialmente las preferencias de notificación.
 * Body: { messages?: boolean, jobAlerts?: boolean, newsletter?: boolean, offersAndRecommendations?: boolean }
 * Enviar solo los toggles que cambiaron — los demás se conservan.
 * Protección: session + ownership
 * Rate limit: mutation
 */
export async function updateNotificationPrefsHandler(
  req: NextRequest,
  userId: string
): Promise<NextResponse> {
  const idError = validateAccountUserId(userId)
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
        const parsed = updateNotificationPrefsSchema.safeParse(body)
        if (!parsed.success) {
          return NextResponse.json(
            fail("VALIDATION_ERROR", parsed.error.issues[0].message),
            { status: 422 }
          )
        }
        const { updateNotifPrefs } = makeAccountUseCases()
        const account = await updateNotifPrefs.execute(userId, parsed.data)
        return NextResponse.json(ok(account))
      } catch (err) {
        return handleAccountError(err)
      }
    },
    session.user.id
  )
}

/**
 * DELETE /api/account/:userId
 * Elimina la cuenta. Verifica existencia y devuelve confirmación.
 *  Protección: session + ownership
 * Rate limit: mutation
 */
export async function deleteAccountHandler(
  req: NextRequest,
  userId: string
): Promise<NextResponse> {
  const idError = validateAccountUserId(userId)
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
        const { getAccount, repo } = makeAccountUseCases()

        // Verifica existencia — lanza AccountNotFoundError si no existe
        const account = await getAccount.execute(userId)
        await repo.delete(userId)

        return NextResponse.json(
          ok({
            message: `Cuenta de '${account.email}' eliminada correctamente`,
            deleted: account,
          })
        )
      } catch (err) {
        return handleAccountError(err)
      }
    },
    session.user.id
  )
}
