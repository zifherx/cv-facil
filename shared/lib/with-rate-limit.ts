import { NextRequest, NextResponse } from "next/server"
import { rateLimiters, type RateLimitTier } from "@/shared/lib"
import { fail } from "@/shared/types"

/**
 * Obtiene el identificador para el rate limit.
 * - Endpoints auth: IP (el usuario no está autenticado aún)
 * - Endpoints protegidos: userId de la sesión o IP como fallback
 */
function getIdentifier(req: NextRequest, userId?: string): string {
  if (userId) return `user:${userId}`
  const forwarded = req.headers.get("x-forwarded-for")
  const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1"
  return `ip:${ip}`
}

/**
 * Decorator de rate limit. Uso:
 *
 * export async function POST(req: NextRequest) {
 *   return withRateLimit(req, "auth", () => createCVHandler(req))
 * }
 *
 * Para endpoints autenticados, pasa el userId para limitar por usuario:
 *   return withRateLimit(req, "mutation", () => handler(req), userId)
 */
export async function withRateLimit(
  req: NextRequest,
  tier: RateLimitTier,
  handler: () => Promise<NextResponse>,
  userId?: string
): Promise<NextResponse> {
  const identifier = getIdentifier(req, userId)
  const { success, limit, remaining, reset } =
    await rateLimiters[tier].limit(identifier)

  if (!success) {
    const retryAfter = Math.ceil((reset - Date.now()) / 1000)
    return NextResponse.json(
      fail(
        "RATE_LIMIT_EXCEEDED",
        `Demasiadas solicitudes. Intenta de nuevo en ${retryAfter} segundos.`
      ),
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": String(limit),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(reset),
          "Retry-After": String(retryAfter),
        },
      }
    )
  }

  const response = await handler()

  // Agregar headers informativos en todas las respuestas exitosas
  response.headers.set("X-RateLimit-Limit", String(limit))
  response.headers.set("X-RateLimit-Remaining", String(remaining))
  response.headers.set("X-RateLimit-Reset", String(reset))

  return response
}
