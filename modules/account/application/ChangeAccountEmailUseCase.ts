import {
  Account,
  AccountEmailAlreadyInUseError,
  AccountNotFoundError,
  ChangeAccountEmailDTO,
  IAccountRepository,
} from "@/modules/account/domain"

export class ChangeAccountEmailUseCase {
  constructor(private readonly accountRepository: IAccountRepository) {}

  async execute(userId: string, data: ChangeAccountEmailDTO): Promise<Account> {
    // 1. Verify account exists
    const existing = await this.accountRepository.findByUserId(userId)
    if (!existing) throw new AccountNotFoundError(userId)

    // 2. Guard: new email must not already be taken by another account
    // We compare normalized emails to prevent case-variation duplicates
    const normalizedNew = data.newEmail.toLowerCase().trim()
    if (existing.email === normalizedNew) {
      throw new AccountEmailAlreadyInUseError(normalizedNew)
    }

    return this.accountRepository.updateEmail(userId, {
      newEmail: normalizedNew,
    })
  }
}
