import { createAuthClient } from "better-auth/react"

/**
 * Cliente de better-auth para usar en componentes React (Client Components).
 * Expone: signIn, signUp, signOut, useSession
 */
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
})

export const { signIn, signUp, signOut, useSession } = authClient
