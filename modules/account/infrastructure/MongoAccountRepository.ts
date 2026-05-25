import {
  Account,
  AccountNotFoundError,
  ChangeAccountEmailDTO,
  CreateAccountDTO,
  IAccountRepository,
  UpdateNotificationPrefsDTO,
} from "@/modules/account/domain"
import {
  AccountModel,
  IAccountDocument,
} from "@/modules/account/infrastructure"

export class MongoAccountRepository implements IAccountRepository {
  // ─── Domain mapper ──────────────────────────────────────────────────────────
  private toDomain(doc: IAccountDocument): Account {
    return {
      id: doc._id.toString(),
      userId: doc.userId.toString(),
      email: doc.email,
      notificationPreferences: {
        messages: doc.notificationPreferences.messages,
        jobAlerts: doc.notificationPreferences.jobAlerts,
        newsletter: doc.notificationPreferences.newsletter,
        offersAndRecommendations:
          doc.notificationPreferences.offersAndRecommendations,
      },
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }
  }

  // ─── Queries ────────────────────────────────────────────────────────────────
  async findByUserId(userId: string): Promise<Account | null> {
    const doc = await AccountModel.findOne({ userId })
    return doc ? this.toDomain(doc) : null
  }

  // ─── Commands ───────────────────────────────────────────────────────────────
  async create(data: CreateAccountDTO): Promise<Account> {
    const doc = await AccountModel.create({
      userId: data.userId,
      email: data.email,
      notificationPreferences: data.notificationPreferences ?? {},
    })
    return this.toDomain(doc)
  }

  async updateEmail(
    userId: string,
    data: ChangeAccountEmailDTO
  ): Promise<Account> {
    const doc = await AccountModel.findOneAndUpdate(
      { userId },
      { $set: { email: data.newEmail.toLowerCase().trim() } },
      { after: true, runValidators: true }
    )
    if (!doc) throw new AccountNotFoundError(userId)
    return this.toDomain(doc)
  }

  async updateNotificationPrefs(
    userId: string,
    data: UpdateNotificationPrefsDTO
  ): Promise<Account> {
    // Build flat $set to allow toggling individual prefs without overwriting others
    const flatUpdate: Record<string, boolean> = {}
    const keys = [
      "messages",
      "jobAlerts",
      "newsletter",
      "offersAndRecommendations",
    ] as const

    for (const key of keys) {
      if (data[key] !== undefined) {
        flatUpdate[`notificationPreferences.${key}`] = data[key]!
      }
    }

    const doc = await AccountModel.findOneAndUpdate(
      { userId },
      { $set: flatUpdate },
      { after: true, runValidators: true }
    )
    if (!doc) throw new AccountNotFoundError(userId)
    return this.toDomain(doc)
  }

  async delete(userId: string): Promise<void> {
    await AccountModel.findOneAndDelete({ userId })
  }
}
