import { comparePassword, encryptPassword } from "@/lib/global-functions"
import { IUserRepository } from "@/modules/users/domain/IUserRepository"
import { UserPublic } from "@/modules/users/domain/User"
import {
  InvalidCredentialsError,
  UserAlreadyExistError,
  UserNotFoundError,
} from "@/modules/users/domain/User-Errors"

export type ChangeEmailInput = {
  operation: "change-email"
  userId: string
  newEmail: string
  currentPassword: string
}

export type ChangePasswordInput = {
  operation: "change-password"
  userId: string
  currentPassword: string
  newPassword: string
}

export type UpdateUserInput = ChangeEmailInput | ChangePasswordInput

export class UpdateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: UpdateUserInput): Promise<UserPublic> {
    const user = await this.userRepository.findById(input.userId)
    if (!user) throw new UserNotFoundError(input.userId)

    const passwordValid = await comparePassword(
      input.currentPassword,
      user.passwordHash
    )
    if (!passwordValid) throw new InvalidCredentialsError()

    if (input.operation === "change-email") {
      const emailTaken = await this.userRepository.findByEmail(input.newEmail)
      if (emailTaken && emailTaken.id !== user.id) {
        throw new UserAlreadyExistError(input.newEmail)
      }

      const updated = await this.userRepository.updateEmail(
        input.userId,
        input.newEmail
      )

      const { passwordHash: _omit, ...userPublic } = updated

      return userPublic
    }

    const newHash = await encryptPassword(input.newPassword)
    const updated = await this.userRepository.updatePassword(
      input.userId,
      newHash
    )

    const { passwordHash: _omit, ...userPublic } = updated
    return userPublic
  }
}
