export interface Address {
  street: string
  city: string
  postalCode: string
  country: string
}

export interface Profile {
  id: string
  userId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  avatarUrl: string | null
  address: Address
  createdAt: string
  updatedAt: string
}

export type UpdateProfileDTO = {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  address?: Partial<Address>
}

export type UpdateAvatarDTO = { avatarUrl: string | null }

export type PROFILE_PROPS = {
  profile: Profile
  userId: string
}

export interface ITabProfile {
  label: string
  href: string
  disabled?: boolean
}
