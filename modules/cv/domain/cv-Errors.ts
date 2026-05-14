import { AppError } from "@/shared/errors"

export class CVNotFoundError extends AppError {
  constructor(id: string) {
    super(`CV no encontrado: ${id}`, "CV_NOT_FOUND", 404)
  }
}

export class CVSectionNotFoundError extends AppError {
  constructor(sectionId: string) {
    super(`Sección no encontrada: ${sectionId}`, "CV_SECTION_NOT_FOUND", 404)
  }
}

export class CVSlugConflictError extends AppError {
  constructor(slug: string) {
    super(`CV slug ya existe: ${slug}`, "CV_SLUG_CONFLICT", 409)
  }
}

export class CVSectionOrderConflictError extends AppError {
  constructor() {
    super(
      "orderedIds must contain all existing section IDs",
      "CV_SECTION_ORDER_CONFLICT",
      422
    )
  }
}
