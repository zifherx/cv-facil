import { IProfileRepository } from "../domain/IProfileRepository"
import { ProfileAlreadyExistsError } from "../domain/Profile-Errors"
import { CreateProfileDTO, Profile } from "../domain/Profile.entity"

export class CreateProfileUseCase {
  constructor(private readonly profileRepository: IProfileRepository) {}

  async execute(data: CreateProfileDTO): Promise<Profile> {
    // Guard: un usuario solo puede tener un perfil
    const existing = await this.profileRepository.findByUserId(data.userId)
    if (existing) throw new ProfileAlreadyExistsError(data.userId)

    return this.profileRepository.create(data)
  }
}
