import { hash, compare } from "bcryptjs"

const SALT_ROUNDS = 12

export const encryptPassword = async (passwordParameter: string) => {
  return await hash(passwordParameter, SALT_ROUNDS)
}

export const comparePassword = async (
  inputPassword: string,
  bdPassword: string
) => {
  return await compare(inputPassword, bdPassword)
}
