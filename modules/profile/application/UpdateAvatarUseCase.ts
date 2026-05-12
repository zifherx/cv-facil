import { IProfileRepository } from "../domain/IProfileRepository"
import { ProfileNotFoundError } from "../domain/Profile-Errors"
import { Profile } from "../domain/Profile.entity"

export type UpdateAvatarInput = {
  userId: string
  avatarUrl: string | null // null = eliminar avatar
}

export class UpdateAvatarUseCase {
  constructor(private readonly profileRepository: IProfileRepository) {}

  async execute(input: UpdateAvatarInput): Promise<Profile> {
    const existing = await this.profileRepository.findByUserId(input.userId)
    if (!existing) throw new ProfileNotFoundError(input.userId)

    return this.profileRepository.updateAvatar(input.userId, input.avatarUrl)
  }
}
