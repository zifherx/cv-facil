import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

/**
 * Tres niveles de rate limit según criticidad del endpoint:
 *
 * AUTH     — más estricto: 5 intentos / 15 min por IP
 *            Protege registro y login contra fuerza bruta
 *
 * MUTATION — moderado: 30 requests / min por usuario
 *            CVs, secciones, profile updates — escrituras
 *
 * READ     — permisivo: 120 requests / min por usuario
 *            GETs de CV, profile, account
 */
export const rateLimiters = {
  auth: new Ratelimit({
    redis,
    limiter: Ratelimit.fixedWindow(5, "15 m"),
    prefix: "rl:auth",
    analytics: true,
  }),

  mutation: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(30, "1 m"),
    prefix: "rl:mutation",
    analytics: true,
  }),

  read: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(120, "1 m"),
    prefix: "rl:read",
    analytics: true,
  }),
}

export type RateLimitTier = keyof typeof rateLimiters
