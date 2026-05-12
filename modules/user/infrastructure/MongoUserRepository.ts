import { IUserRepository } from "@/modules/users/domain/IUserRepository"
import { CreateUserDTO, User } from "@/modules/users/domain/User"
import { UserNotFoundError } from "@/modules/users/domain/User-Errors"
import {
  IUserDocument,
  UserModel,
} from "@/modules/users/infrastructure/UserModel"

export class MongoUserRepository implements IUserRepository {
  private toDomain(doc: IUserDocument): User {
    return {
      id: doc._id.toString(),
      email: doc.email,
      passwordHash: doc.passwordHash,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }
  }

  async findById(id: string): Promise<User | null> {
    const doc = await UserModel.findById(id).lean()
    return doc ? this.toDomain(doc) : null
  }

  async findByEmail(email: string): Promise<User | null> {
    const doc = await UserModel.findOne({
      email: email.toLowerCase().trim(),
    }).lean()
    return doc ? this.toDomain(doc) : null
  }

  async create(data: CreateUserDTO): Promise<User> {
    const doc = await UserModel.create(data)
    return this.toDomain(doc)
  }

  async updateEmail(id: string, newEmail: string): Promise<User> {
    const doc = await UserModel.findByIdAndUpdate(
      id,
      { email: newEmail.toLowerCase().trim() },
      { after: true, runValidators: true }
    )
    if (!doc) throw new UserNotFoundError(id)
    return this.toDomain(doc)
  }

  async updatePassword(id: string, newPasswordHash: string): Promise<User> {
    const doc = await UserModel.findByIdAndUpdate(
      id,
      { passwordHash: newPasswordHash },
      { after: true }
    )
    if (!doc) throw new UserNotFoundError(id)
    return this.toDomain(doc)
  }

  async delete(id: string): Promise<void> {
    await UserModel.findByIdAndDelete(id)
  }
}
