import {
  CreateProfileUseCase,
  GetProfileUseCase,
  UpdateAvatarUseCase,
  UpdateProfileUseCase,
} from "@/modules/profile/application"
import { MongoProfileRepository } from "@/modules/profile/infrastructure"

export const makeProfileUseCases = () => {
  const repo = new MongoProfileRepository()
  return {
    getProfile: new GetProfileUseCase(repo),
    createProfile: new CreateProfileUseCase(repo),
    updateProfile: new UpdateProfileUseCase(repo),
    updateAvatar: new UpdateAvatarUseCase(repo),
    repo,
  }
}
