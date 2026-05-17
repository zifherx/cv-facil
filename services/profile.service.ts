import { del, get, patch } from "@/lib"
import type { Profile, UpdateAvatarDTO, UpdateProfileDTO } from "@/types"

const BASE = (userId: string) => `/profile/${userId}`
interface HTTP_DELETE_INTERFACE {
  message: string
  deleted: Profile
}

export const profileService = {
  get: (userId: string) => get<Profile>(BASE(userId)),
  update: (userId: string, data: UpdateProfileDTO) =>
    patch<Profile>(BASE(userId), data),
  updateAvatar: (userId: string, data: UpdateAvatarDTO) =>
    patch<Profile>(`${BASE(userId)}/avatar`, data),
  delete: (userId: string) => del<HTTP_DELETE_INTERFACE>(BASE(userId)),
}
