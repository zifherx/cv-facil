export interface AdminUser {
  id: string
  name: string
  email: string
  role: string // "user" | "admin"
  createdAt: Date
  updatedAt: Date
}

export interface AdminUserStats {
  total: number
  admins: number
  lastWeek: number // usuarios creados en los últimos 7 días
}

export type ChangeRoleDTO = {
  role: "user" | "admin"
}
