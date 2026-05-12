import { AppError } from "@/shared/errors/App-Error"

export class UserNotFoundError extends AppError {
  constructor(identifier: string) {
    super(`User not found: ${identifier}`, `USER_NOT_FOUND`, 404)
  }
}

export class UserAlreadyExistError extends AppError {
  constructor(email: string) {
    super(`User already exists: ${email}`, `USER_ALREADY_EXISTS`, 409)
  }
}

export class InvalidCredentialsError extends AppError {
  constructor() {
    super("Invalid credentials", "INVALID_CREDENTIALS", 401)
  }
}
