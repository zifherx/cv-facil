import { IProfileRepository } from "../domain/IProfileRepository"
import { ProfileNotFoundError } from "../domain/Profile-Errors"
import { Profile, UpdateProfileDTO } from "../domain/Profile.entity"

export class UpdateProfileUseCase {
  constructor(private readonly profileRepository: IProfileRepository) {}

  async execute(userId: string, data: UpdateProfileDTO): Promise<Profile> {
    const existing = await this.profileRepository.findByUserId(userId)
    if (!existing) throw new ProfileNotFoundError(userId)

    return this.profileRepository.update(userId, data)
  }
}
