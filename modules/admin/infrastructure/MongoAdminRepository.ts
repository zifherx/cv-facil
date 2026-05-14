import {
  AdminUser,
  AdminUserNotFoundError,
  AdminUserStats,
  ChangeRoleDTO,
  IAdminRepository,
} from "@/modules/admin/domain"
import { MongoClient, ObjectId } from "mongodb"

// Forma del documento en la colección "user" de better-auth
interface BetterAuthUserDoc {
  _id: ObjectId
  name: string
  email: string
  role?: string
  createdAt: Date
  updatedAt: Date
}

export class MongoAdminRepository implements IAdminRepository {
  constructor(private readonly client: MongoClient) {}

  // better-auth usa la colección "user" (singular)
  private get col() {
    return this.client.db().collection<BetterAuthUserDoc>("user")
  }

  private toDomain(doc: BetterAuthUserDoc): AdminUser {
    return {
      id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
      role: doc.role ?? "user",
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }
  }

  async findAll(
    page: number,
    limit: number
  ): Promise<{ users: AdminUser[]; total: number }> {
    const skip = (page - 1) * limit
    const [docs, total] = await Promise.all([
      this.col.find().sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
      this.col.countDocuments(),
    ])
    return { users: docs.map((d) => this.toDomain(d)), total }
  }

  async findById(id: string): Promise<AdminUser | null> {
    const doc = await this.col.findOne({ _id: new ObjectId(id) })
    return doc ? this.toDomain(doc) : null
  }

  async findByEmail(email: string): Promise<AdminUser | null> {
    const doc = await this.col.findOne({ email: email.toLowerCase().trim() })
    return doc ? this.toDomain(doc) : null
  }

  async changeRole(id: string, data: ChangeRoleDTO): Promise<AdminUser> {
    const doc = await this.col.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { role: data.role, updatedAt: new Date() } },
      { returnDocument: "after" }
    )
    if (!doc) throw new AdminUserNotFoundError(id)
    return this.toDomain(doc)
  }

  async getStats(): Promise<AdminUserStats> {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const [total, admins, lastWeek] = await Promise.all([
      this.col.countDocuments(),
      this.col.countDocuments({ role: "admin" }),
      this.col.countDocuments({ createdAt: { $gte: oneWeekAgo } }),
    ])
    return { total, admins, lastWeek }
  }
}
