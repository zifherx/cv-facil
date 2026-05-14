import {
  Account,
  AccountNotFoundError,
  IAccountRepository,
} from "@/modules/account/domain"

export class GetAccountUseCase {
  constructor(private readonly accountRepository: IAccountRepository) {}

  async execute(userId: string): Promise<Account> {
    const account = await this.accountRepository.findByUserId(userId)
    if (!account) throw new AccountNotFoundError(userId)
    return account
  }
}
