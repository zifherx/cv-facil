export interface Address {
  street: string
  city: string
  postalCode: string
  country: string // ISO 3166-1 alpha-2  e.g. "PE", "US"
}

export interface Profile {
  id: string
  userId: string // 1-to-1 with User — FK, never changes
  firstName: string
  lastName: string
  email: string // display email — puede diferir del auth email
  phone: string
  avatarUrl: string | null
  address: Address
  createdAt: Date
  updatedAt: Date
}

export type CreateProfileDTO = {
  userId: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  avatarUrl?: string | null
  address?: Partial<Address>
}

export type UpdateProfileDTO = Partial<
  Omit<Profile, "id" | "userId" | "createdAt" | "updatedAt">
>
