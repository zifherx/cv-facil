import { IProfileRepository } from "@/modules/profile/domain/IProfileRepository"
import { ProfileNotFoundError } from "../domain/Profile-Errors"
import {
  CreateProfileDTO,
  Profile,
  UpdateProfileDTO,
} from "../domain/Profile.entity"
import { IProfileDocument, ProfileModel } from "./ProfileModel"

export class MongoProfileRepository implements IProfileRepository {
  // ─── Domain mapper ──────────────────────────────────────────────────────────
  private toDomain(doc: IProfileDocument): Profile {
    return {
      id: doc._id.toString(),
      userId: doc.userId.toString(),
      firstName: doc.firstName,
      lastName: doc.lastName,
      email: doc.email,
      phone: doc.phone,
      avatarUrl: doc.avatarUrl,
      address: {
        street: doc.address.street,
        city: doc.address.city,
        postalCode: doc.address.postalCode,
        country: doc.address.country,
      },
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }
  }

  // ─── Queries ────────────────────────────────────────────────────────────────
  async findByUserId(userId: string): Promise<Profile | null> {
    const doc = await ProfileModel.findOne({ userId })
    return doc ? this.toDomain(doc) : null
  }

  // ─── Commands ───────────────────────────────────────────────────────────────
  async create(data: CreateProfileDTO): Promise<Profile> {
    const doc = await ProfileModel.create({
      userId: data.userId,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone ?? "",
      avatarUrl: data.avatarUrl ?? null,
      address: data.address ?? {},
    })
    return this.toDomain(doc)
  }

  async update(userId: string, data: UpdateProfileDTO): Promise<Profile> {
    // Build a flat update to support nested address fields via $set
    const flatUpdate: Record<string, unknown> = {}

    if (data.firstName !== undefined) flatUpdate.firstName = data.firstName
    if (data.lastName !== undefined) flatUpdate.lastName = data.lastName
    if (data.email !== undefined)
      flatUpdate.email = data.email.toLowerCase().trim()
    if (data.phone !== undefined) flatUpdate.phone = data.phone
    if (data.avatarUrl !== undefined) flatUpdate.avatarUrl = data.avatarUrl

    // Merge nested address fields individually — avoids wiping unset sub-fields
    if (data.address) {
      const { street, city, postalCode, country } = data.address
      if (street !== undefined) flatUpdate["address.street"] = street
      if (city !== undefined) flatUpdate["address.city"] = city
      if (postalCode !== undefined)
        flatUpdate["address.postalCode"] = postalCode
      if (country !== undefined) flatUpdate["address.country"] = country
    }

    const doc = await ProfileModel.findOneAndUpdate(
      { userId },
      { $set: flatUpdate },
      { new: true, runValidators: true }
    )
    if (!doc) throw new ProfileNotFoundError(userId)
    return this.toDomain(doc)
  }

  async updateAvatar(
    userId: string,
    avatarUrl: string | null
  ): Promise<Profile> {
    const doc = await ProfileModel.findOneAndUpdate(
      { userId },
      { $set: { avatarUrl } },
      { new: true }
    )
    if (!doc) throw new ProfileNotFoundError(userId)
    return this.toDomain(doc)
  }

  async delete(userId: string): Promise<void> {
    await ProfileModel.findOneAndDelete({ userId })
  }
}
