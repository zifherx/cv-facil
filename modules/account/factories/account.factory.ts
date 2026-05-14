import {
  ChangeAccountEmailUseCase,
  CreateAccountUseCase,
  GetAccountUseCase,
  UpdateNotificationPrefsUseCase,
} from "@/modules/account/application"
import { MongoAccountRepository } from "@/modules/account/infrastructure"

export const makeAccountUseCases = () => {
  const repo = new MongoAccountRepository()
  return {
    getAccount: new GetAccountUseCase(repo),
    createAccount: new CreateAccountUseCase(repo),
    changeEmail: new ChangeAccountEmailUseCase(repo),
    updateNotifPrefs: new UpdateNotificationPrefsUseCase(repo),
    repo,
  }
}
