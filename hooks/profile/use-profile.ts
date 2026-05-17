import { queryKeys } from "@/hooks"
import { profileService } from "@/services"
import { UpdateAvatarDTO, UpdateProfileDTO } from "@/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

// Queries
export function useProfile(userId: string) {
  return useQuery({
    queryKey: queryKeys.profile.detail(userId),
    queryFn: () => profileService.get(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 min - el perfil no cambia frecuentemente
  })
}

// Mutations
export function useUpdateProfile(userId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateProfileDTO) => profileService.update(userId, data),

    onMutate: async (newData) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.profile.detail(userId),
      })

      const previous = queryClient.getQueryData(
        queryKeys.profile.detail(userId)
      )

      queryClient.setQueryData(
        queryKeys.profile.detail(userId),
        (old: typeof previous) => (old ? { ...old, ...newData } : old)
      )

      return { previous }
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          queryKeys.profile.detail(userId),
          context.previous
        )
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.profile.detail(userId),
      })
    },
  })
}

export function useUpdateAvatar(userId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateAvatarDTO) =>
      profileService.updateAvatar(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.profile.detail(userId),
      })
    },
  })
}

export function useDeleteProfile(userId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => profileService.delete(userId),
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: queryKeys.profile.all(),
      })
    },
  })
}
