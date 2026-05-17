export interface AuthUser {
  id: string
  name: string
  email: string
  role: string
}

export interface RegisterDTO {
  firstName: string
  lastName: string
  email: string
  password: string
}
