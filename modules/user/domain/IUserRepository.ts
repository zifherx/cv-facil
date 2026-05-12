import { CreateUserDTO, User } from "./User.entity"

export interface IUserRepository {
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  create(data: CreateUserDTO): Promise<User>
  updateEmail(id: string, newEmail: string): Promise<User>
  updatePassword(is: string, newPasswordHash: string): Promise<User>
  delete(id: string): Promise<void>
}
