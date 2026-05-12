import { IProfileRepository } from "../domain/IProfileRepository"
import { ProfileNotFoundError } from "../domain/Profile-Errors"
import { Profile } from "../domain/Profile.entity"

export class GetProfileUseCase {
  constructor(private readonly profileRepository: IProfileRepository) {}

  async execute(userId: string): Promise<Profile> {
    const profile = await this.profileRepository.findByUserId(userId)
    if (!profile) throw new ProfileNotFoundError(userId)
    return profile
  }
}
