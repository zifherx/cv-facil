import { encryptPassword } from "@/lib/global-functions"
import { IUserRepository } from "@/modules/users/domain/IUserRepository"
import { User } from "@/modules/users/domain/User"
import { UserAlreadyExistError } from "@/modules/users/domain/User-Errors"

export type CreateUserInput = {
  email: string
  password: string
}

export class CreateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: CreateUserInput): Promise<Omit<User, "passwordHash">> {
    const { email, password } = input

    const existing = await this.userRepository.findByEmail(email)
    if (existing) throw new UserAlreadyExistError(email)

    const passwordHash = await encryptPassword(password)
    const user = await this.userRepository.create({ email, passwordHash })

    const { passwordHash: _omit, ...userPublic } = user
    return userPublic
  }
}
