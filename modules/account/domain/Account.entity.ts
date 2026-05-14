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
  createdAt: Date
  updatedAt: Date
}

export type CreateAccountDTO = {
  userId: string
  email: string
  notificationPreferences?: Partial<NotificationPreferences>
}

export type UpdateNotificationPrefsDTO = Partial<NotificationPreferences>

export type ChangeAccountEmailDTO = {
  newEmail: string
}
