export interface Address {
  street: string
  city: string
  postalCode: string
  country: string // e.g. "PE", "US"
}

export type PartialAddress = Partial<Address>

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
  address?: PartialAddress
}

export type UpdateProfileDTO = Partial<Omit<CreateProfileDTO, "userId">>
