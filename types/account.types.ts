import { ReactNode } from "react"
import { useForm } from "react-hook-form"

export interface NotificationPreferences {
  messages: boolean
  jobAlerts: boolean
  newsletter: boolean
  offersAndRecommendations: boolean
}

export interface Account {
  id: string
  userId: string
  email: string
  notificationPreferences: NotificationPreferences
  createdAt: string
  updatedAt: string
}

export type UpdateNotificationPrefsDTO = Partial<NotificationPreferences>
export type ChangeAccountEmailDTO = { newEmail: string }

export type ACCOUNT_SECTION_CARD_PROPS = {
  title: string
  description: string
  children: ReactNode
}

export type ACCOUNT_EMAIL_PROPS = {
  account: Account
  userId: string
}

export interface IResultPasswordStrength {
  score: number
  label: string
  color: string
}

export type PASSWORD_INPUT_PROPS = {
  id: string
  label: string
  placeholder?: string
  registration: ReturnType<ReturnType<typeof useForm>["register"]>
  error?: string
}

export type ACCOUNT_NOTIFICACTIONS_PROPS = {
  account: Account
  userId: string
}

export type NOTIFICATION_ROW_PROPS = {
  item: INotificationItem
  checked: boolean
  onToggle: (key: NotifKey, value: boolean) => void
  disabled: boolean
  isLast: boolean
}

export type NotifKey = keyof NotificationPreferences

export interface INotificationItem {
  key: NotifKey
  title: string
  desc: string
}
