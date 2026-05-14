import {
  Account,
  ChangeAccountEmailDTO,
  CreateAccountDTO,
  UpdateNotificationPrefsDTO,
} from "@/modules/account/domain"

export interface IAccountRepository {
  findByUserId(userId: string): Promise<Account | null>
  create(data: CreateAccountDTO): Promise<Account>
  updateEmail(userId: string, data: ChangeAccountEmailDTO): Promise<Account>
  updateNotificationPrefs(
    userId: string,
    data: UpdateNotificationPrefsDTO
  ): Promise<Account>
  delete(userId: string): Promise<void>
}
