import {
  ChangeUserRoleUseCase,
  GetAdminUserUseCase,
  GetUserStatsUseCase,
  ListUsersUseCase,
} from "@/modules/admin/application"
import { MongoAdminRepository } from "@/modules/admin/infrastructure"
import { MongoClient } from "mongodb"

/**
 * El repositorio admin usa el cliente nativo de MongoDB (mismo que better-auth),
 * NO Mongoose. Pasamos el cliente como parámetro para poder mockearlo en tests.
 */
export const makeAdminUseCases = (client: MongoClient) => {
  const repo = new MongoAdminRepository(client)
  return {
    listUsers: new ListUsersUseCase(repo),
    getUser: new GetAdminUserUseCase(repo),
    changeRole: new ChangeUserRoleUseCase(repo),
    getStats: new GetUserStatsUseCase(repo),
  }
}
