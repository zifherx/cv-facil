import { CreateProfileDTO, Profile, UpdateProfileDTO } from "./Profile.entity"

export interface IProfileRepository {
  findByUserId(userId: string): Promise<Profile | null>
  create(data: CreateProfileDTO): Promise<Profile>
  update(userId: string, data: UpdateProfileDTO): Promise<Profile>
  updateAvatar(userId: string, avatarUrl: string | null): Promise<Profile>
  delete(userId: string): Promise<void>
}
