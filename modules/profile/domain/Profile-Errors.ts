import { AppError } from "@/shared/errors/App-Error"

export class ProfileNotFoundError extends AppError {
  constructor(userId: string) {
    super(`Profile not found for user: ${userId}`, "PROFILE_NOT_FOUND", 404)
  }
}

export class ProfileAlreadyExistsError extends AppError {
  constructor(userId: string) {
    super(
      `Profile already exists for user: ${userId}`,
      "PROFILE_ALREADY_EXISTS",
      409
    )
  }
}
