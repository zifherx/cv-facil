import { auth } from "@/shared/lib"
import { fail } from "@/shared/types"
import { headers } from "next/headers"
import { NextResponse } from "next/server"

type BetterAuthSession = Awaited<ReturnType<typeof auth.api.getSession>>

export interface SessionResult {
  session: NonNullable<BetterAuthSession>
  error: null
}

export interface SessionError {
  session: null
  error: NextResponse
}

/**
 * Obtiene y valida la sesión en cualquier API route handler.
 *
 * Patrón de uso:
 *   const { session, error } = await requireSession()
 *   if (error) return error
 *   const userId = session.user.id  // ← tipado correcto, sin null checks
 */

export async function requireSession(): Promise<SessionResult | SessionError> {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return {
      session: null,
      error: NextResponse.json(
        fail("UNAUTHORIZED", "Sesión requerida. Inicia sesión para continuar"),
        {
          status: 401,
        }
      ),
    }
  }

  return { session, error: null }
}
