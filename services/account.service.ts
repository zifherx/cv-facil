import { del, get, patch } from "@/lib"
import type {
  Account,
  ChangeAccountEmailDTO,
  UpdateNotificationPrefsDTO,
} from "@/types"

const BASE = (userId: string) => `/account/${userId}`
interface HTTP_DELETE_INTERFACE {
  message: string
  deleted: Account
}

export const accountService = {
  get: (userId: string) => get<Account>(BASE(userId)),
  changeEmail: (userId: string, data: ChangeAccountEmailDTO) =>
    patch<Account>(`${BASE(userId)}/email`, data),
  updateNotifications: (userId: string, data: UpdateNotificationPrefsDTO) =>
    patch<Account>(`${BASE(userId)}/notifications`, data),
  delete: (userId: string) => del<HTTP_DELETE_INTERFACE>(BASE(userId)),
}
