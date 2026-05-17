/**
 * Fábrica de query keys para TanStack Query.
 * Centralizar las keys evita typos, permite invalidaciones precisas
 * y hace el refactoring seguro.
 *
 * Patrón: [módulo, operación, ...params]
 * Esto permite invalidar por nivel:
 *   queryClient.invalidateQueries({ queryKey: queryKeys.cv.all() })
 *   → invalida TODOS los queries del módulo cv
 *
 *   queryClient.invalidateQueries({ queryKey: queryKeys.cv.detail(id) })
 *   → invalida solo ese CV específico
 */

export const queryKeys = {
  // Profile
  profile: {
    all: () => ["profile"] as const,
    detail: (userId: string) => ["profile", userId] as const,
  },
  // Account
  account: {
    all: () => ["account"] as const,
    detail: (userId: string) => ["account", userId] as const,
  },
  // CV
  cv: {
    all: () => ["cv"] as const,
    lists: () => ["cv", "list"] as const,
    detail: (cvId: string) => ["cv", cvId] as const,
    sections: (cvId: string) => ["cv", cvId, "sections"] as const,
  },
  // Auth
  auth: {
    session: () => ["auth", "session"] as const,
    user: () => ["auth", "user"] as const,
  },
}
