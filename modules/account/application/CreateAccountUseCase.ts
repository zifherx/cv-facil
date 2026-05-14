import {
  Account,
  AccountAlreadyExistsError,
  CreateAccountDTO,
  IAccountRepository,
} from "@/modules/account/domain"

export class CreateAccountUseCase {
  constructor(private readonly accountRepository: IAccountRepository) {}

  async execute(data: CreateAccountDTO): Promise<Account> {
    const existing = await this.accountRepository.findByUserId(data.userId)
    if (existing) throw new AccountAlreadyExistsError(data.userId)

    return this.accountRepository.create(data)
  }
}
