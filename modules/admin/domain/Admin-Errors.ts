import { AppError } from "@/shared/errors"

export class AdminUserNotFoundError extends AppError {
  constructor(identifier: string) {
    super(
      `Admin: usuario no encontrado: ${identifier}`,
      "ADMIN_USER_NOT_FOUND",
      404
    )
  }
}

export class AdminForbiddenError extends AppError {
  constructor() {
    super("Acceso restringido a administradores", "ADMIN_FORBIDDEN", 403)
  }
}

export class AdminCannotDemoteSelfError extends AppError {
  constructor() {
    super(
      "No puedes cambiar tu propio rol de administrador",
      "ADMIN_CANNOT_DEMOTE_SELF",
      422
    )
  }
}
