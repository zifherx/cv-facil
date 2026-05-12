import { IUserRepository } from "@/modules/users/domain/IUserRepository"
import { UserPublic } from "@/modules/users/domain/User"
import { UserNotFoundError } from "@/modules/users/domain/User-Errors"

type GetByIdInput = { by: "id"; value: string }
type GetByEmailInput = { by: "email"; value: string }
export type GetUserInput = GetByIdInput | GetByEmailInput

export class GetUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: GetUserInput): Promise<UserPublic> {
    const raw =
      input.by === "id"
        ? await this.userRepository.findById(input.value)
        : await this.userRepository.findByEmail(input.value)

    if (!raw) throw new UserNotFoundError(input.value)

    const { passwordHash: _omit, ...userPublic } = raw
    return userPublic
  }
}
