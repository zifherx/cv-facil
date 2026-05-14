import {
  Account,
  AccountNotFoundError,
  IAccountRepository,
  UpdateNotificationPrefsDTO,
} from "@/modules/account/domain"

export class UpdateNotificationPrefsUseCase {
  constructor(private readonly accountRepository: IAccountRepository) {}

  async execute(
    userId: string,
    data: UpdateNotificationPrefsDTO
  ): Promise<Account> {
    const existing = await this.accountRepository.findByUserId(userId)
    if (!existing) throw new AccountNotFoundError(userId)

    return this.accountRepository.updateNotificationPrefs(userId, data)
  }
}
