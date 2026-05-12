export interface User {
  id: string
  email: string
  passwordHash: string
  createdAt: Date
  updatedAt: Date
}

export type CreateUserDTO = {
  email: string
  passwordHash: string
}

export type UserPublic = Omit<User, "passwordHash">
