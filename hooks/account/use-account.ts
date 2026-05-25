// ─── Queries ──────────────────────────────────────────────────────────────────

import { queryKeys } from "@/hooks"
import { accountService } from "@/services"
import { ChangeAccountEmailDTO, UpdateNotificationPrefsDTO } from "@/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export function useAccount(userId: string) {
  return useQuery({
    queryKey: queryKeys.account.detail(userId),
    queryFn: () => accountService.get(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  })
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function useChangeAccountEmail(userId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ChangeAccountEmailDTO) =>
      accountService.changeEmail(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.account.detail(userId),
      })
    },
  })
}

export function useUpdateNotifications(userId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateNotificationPrefsDTO) =>
      accountService.updateNotifications(userId, data),

    // Optimistic update para los toggles — se sienten instantáneos
    onMutate: async (newPrefs) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.account.detail(userId),
      })
      const previous = queryClient.getQueryData(
        queryKeys.account.detail(userId)
      )
      queryClient.setQueryData(
        queryKeys.account.detail(userId),
        (old: typeof previous) =>
          old
            ? {
                ...old,
                notificationPreferences: {
                  ...(old as { notificationPreferences: object })
                    .notificationPreferences,
                  ...newPrefs,
                },
              }
            : old
      )
      return { previous }
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          queryKeys.account.detail(userId),
          context.previous
        )
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.account.detail(userId),
      })
    },
  })
}
