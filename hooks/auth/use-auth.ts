"use client"
// ─── Session query ────────────────────────────────────────────────────────────

import { queryKeys } from "@/hooks"
import { authService } from "@/services"
import { RegisterDTO } from "@/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

export function useSession() {
  return useQuery({
    queryKey: queryKeys.auth.session(),
    queryFn: authService.getSession,
    staleTime: 1000 * 60 * 5, // 5 min
    retry: false, // no reintentar en 401
  })
}

/** Devuelve el userId del usuario autenticado o null */
export function useUserId(): string | null {
  const { data } = useSession()
  return (data as { user?: { id: string } } | null)?.user?.id ?? null
}

// ─── Auth mutations ───────────────────────────────────────────────────────────

export function useRegister() {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: RegisterDTO) => authService.register(data),
    onSuccess: () => {
      // Invalidar la sesión para que se recargue con el nuevo usuario
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.session() })
      router.push("/dashboard")
    },
  })
}

export function useSignIn() {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.signIn(email, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.session() })
      router.push("/dashboard")
    },
  })
}

export function useSignOut() {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authService.signOut,
    onSuccess: () => {
      // Limpiar TODA la caché al cerrar sesión
      queryClient.clear()
      router.push("/auth/login")
    },
  })
}
