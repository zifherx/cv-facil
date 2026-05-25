import { AppError } from "@/shared/errors"

export class AccountNotFoundError extends AppError {
  constructor(userId: string) {
    super(`Account not found for user: ${userId}`, "ACCOUNT_NOT_FOUND", 404)
  }
}

export class AccountAlreadyExistsError extends AppError {
  constructor(userId: string) {
    super(
      `Account already exists for user: ${userId}`,
      "ACCOUNT_ALREADY_EXISTS",
      409
    )
  }
}

export class AccountEmailAlreadyInUseError extends AppError {
  constructor(email: string) {
    super(`Email already in use: ${email}`, "ACCOUNT_EMAIL_ALREADY_IN_USE", 409)
  }
}
