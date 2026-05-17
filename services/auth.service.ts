import { post } from "@/lib"
import { authClient } from "@/shared/lib/auth-client"
import { AuthUser, RegisterDTO } from "@/types"

export const authService = {
  /**
   * Registro — usa el endpoint propio que crea User + Profile + Account.
   * No usa better-auth directamente porque necesitamos crear los módulos extra.
   */
  register: (data: RegisterDTO) =>
    post<{ message: string; user: AuthUser }>("/auth/register", data),

  /**
   * Login — delega a better-auth client (gestiona cookie de sesión automáticamente)
   */
  signIn: (email: string, password: string) =>
    authClient.signIn.email({ email, password }),

  /**
   * Logout
   */
  signOut: () => authClient.signOut(),

  /**
   * Sesión actual
   */
  getSession: () => authClient.getSession(),
}
