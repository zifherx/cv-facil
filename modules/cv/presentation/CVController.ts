import { makeCVUseCases } from "@/modules/cv/factories"
import {
  handleCVError,
  validateCVId,
  validateSectionId,
} from "@/modules/cv/helpers"
import {
  createCVSchema,
  reorderSectionsSchema,
  updateCVTitleSchema,
  updateDocumentConfigSchema,
  upsertSectionSchema,
} from "@/modules/cv/presentation"
import {
  conectarBD,
  requireSession,
  resolveCVWithOwnership,
  withRateLimit,
} from "@/shared/lib"
import { fail, ok } from "@/shared/types"
import { NextRequest, NextResponse } from "next/server"

// ─── CV handlers ──────────────────────────────────────────────────────────────

/**
 * POST /api/cv
 * Crea un nuevo CV con secciones por defecto (profile, experience, education,
 * technical_skills, languages).
 */
export async function createCVHandler(req: NextRequest): Promise<NextResponse> {
  const { session, error } = await requireSession()
  if (error) return error

  return withRateLimit(
    req,
    "mutation",
    async () => {
      try {
        await conectarBD()
        const body = await req.json()
        const parsed = createCVSchema.safeParse({
          ...body,
          userId: session.user.id,
        })
        if (!parsed.success) {
          return NextResponse.json(
            fail("VALIDATION_ERROR", parsed.error.issues[0].message),
            { status: 422 }
          )
        }
        const { createCV } = makeCVUseCases()
        const cv = await createCV.execute(parsed.data)
        return NextResponse.json(ok(cv), { status: 201 })
      } catch (err) {
        return handleCVError(err)
      }
    },
    session.user.id
  )
}

/**
 * GET /api/cv?userId=:userId
 * Lista todos los CVs de un usuario, ordenados por updatedAt desc.
 * * Protección: session + ownership (solo puede listar sus propios CVs)
 * Rate limit: read
 */
export async function listCVsHandler(req: NextRequest): Promise<NextResponse> {
  const { session, error } = await requireSession()
  if (error) return error

  const { searchParams } = new URL(req.url)
  const requestedUserId = searchParams.get("userId") ?? ""

  if (requestedUserId && requestedUserId !== session.user.id) {
    return NextResponse.json(
      fail("FORBIDDEN", "No tienes acceso a este recurso"),
      { status: 403 }
    )
  }

  const idError = validateCVId(session.user.id)
  if (idError) return idError

  return withRateLimit(
    req,
    "read",
    async () => {
      try {
        await conectarBD()
        const { listCVs } = makeCVUseCases()
        const cvs = await listCVs.execute(session.user.id)
        return NextResponse.json(ok(cvs))
      } catch (err) {
        return handleCVError(err)
      }
    },
    session.user.id
  )
}

/**
 * GET /api/cv/:cvId
 * Obtiene un CV completo con todas sus secciones.
 *  Protección: session + ownership
 * Rate limit: read
 */
export async function getCVHandler(
  req: NextRequest,
  cvId: string
): Promise<NextResponse> {
  const idError = validateCVId(cvId)
  if (idError) return idError

  const { session, error } = await requireSession()
  if (error) return error

  return withRateLimit(
    req,
    "read",
    async () => {
      try {
        await conectarBD()
        const { ownerError, cv } = await resolveCVWithOwnership(
          cvId,
          session.user.id
        )
        if (ownerError) return ownerError
        return NextResponse.json(ok(cv))
      } catch (err) {
        return handleCVError(err)
      }
    },
    session.user.id
  )
}

/**
 * PATCH /api/cv/:cvId
 * Actualiza el título del CV.
 * Protección: session + ownership
 * Rate limit: mutation
 */
export async function updateCVTitleHandler(
  req: NextRequest,
  cvId: string
): Promise<NextResponse> {
  const idError = validateCVId(cvId)
  if (idError) return idError

  const { session, error } = await requireSession()
  if (error) return error

  return withRateLimit(
    req,
    "mutation",
    async () => {
      try {
        await conectarBD()
        const { ownerError } = await resolveCVWithOwnership(
          cvId,
          session.user.id
        )
        if (ownerError) return ownerError

        const body = await req.json()
        const parsed = updateCVTitleSchema.safeParse(body)
        if (!parsed.success) {
          return NextResponse.json(
            fail("VALIDATION_ERROR", parsed.error.issues[0].message),
            { status: 422 }
          )
        }
        const { updateTitle } = makeCVUseCases()
        const cv = await updateTitle.execute(cvId, parsed.data)
        return NextResponse.json(ok(cv))
      } catch (err) {
        return handleCVError(err)
      }
    },
    session.user.id
  )
}

/**
 * DELETE /api/cv/:cvId
 * Elimina el CV y todas sus secciones. Devuelve confirmación.
 * Protección: session + ownership
 * Rate limit: mutation
 */
export async function deleteCVHandler(
  req: NextRequest,
  cvId: string
): Promise<NextResponse> {
  const idError = validateCVId(cvId)
  if (idError) return idError

  const { session, error } = await requireSession()
  if (error) return error

  return withRateLimit(
    req,
    "mutation",
    async () => {
      try {
        await conectarBD()
        const { cv, ownerError } = await resolveCVWithOwnership(
          cvId,
          session.user.id
        )
        if (ownerError) return ownerError

        const { deleteCV } = makeCVUseCases()
        await deleteCV.execute(cvId)

        return NextResponse.json(
          ok({
            message: `CV '${cv!.title}' eliminado correctamente`,
            deleted: cv,
          })
        )
      } catch (err) {
        return handleCVError(err)
      }
    },
    session.user.id
  )
}

// ─── Document config handler ─────────────────────────────────────────────────

/**
 * PATCH /api/cv/:cvId/config
 * Actualiza parcialmente la configuración del documento
 * (template, color, fuente, tamaño, idioma).
 * Protección: session + ownership
 * Rate limit: mutation
 */
export async function updateDocumentConfigHandler(
  req: NextRequest,
  cvId: string
): Promise<NextResponse> {
  const idError = validateCVId(cvId)
  if (idError) return idError

  const { session, error } = await requireSession()
  if (error) return error

  return withRateLimit(
    req,
    "mutation",
    async () => {
      try {
        await conectarBD()
        const { ownerError } = await resolveCVWithOwnership(
          cvId,
          session.user.id
        )
        if (ownerError) return ownerError

        const body = await req.json()
        const parsed = updateDocumentConfigSchema.safeParse(body)
        if (!parsed.success) {
          return NextResponse.json(
            fail("VALIDATION_ERROR", parsed.error.issues[0].message),
            { status: 422 }
          )
        }
        const { updateConfig } = makeCVUseCases()
        const cv = await updateConfig.execute(cvId, parsed.data)
        return NextResponse.json(ok(cv))
      } catch (err) {
        return handleCVError(err)
      }
    },
    session.user.id
  )
}

// ─── Section handlers ─────────────────────────────────────────────────────────

/**
 * PUT /api/cv/:cvId/sections/:sectionId
 * Crea o actualiza una sección.
 * sectionId = "new" → inserta | sectionId = ObjectId → actualiza
 * Protección: session + ownership
 * Rate limit: mutation
 */
export async function upsertSectionHandler(
  req: NextRequest,
  cvId: string,
  sectionId: string
): Promise<NextResponse> {
  const cvIdError = validateCVId(cvId)
  if (cvIdError) return cvIdError

  const sectionIdError = validateSectionId(sectionId)
  if (sectionIdError) return sectionIdError

  const { session, error } = await requireSession()
  if (error) return error

  return withRateLimit(
    req,
    "mutation",
    async () => {
      try {
        await conectarBD()
        const { ownerError } = await resolveCVWithOwnership(
          cvId,
          session.user.id
        )
        if (ownerError) return ownerError

        const body = await req.json()
        const parsed = upsertSectionSchema.safeParse(body)
        if (!parsed.success) {
          return NextResponse.json(
            fail("VALIDATION_ERROR", parsed.error.issues[0].message),
            { status: 422 }
          )
        }
        const { upsertSection } = makeCVUseCases()
        const cv = await upsertSection.execute(
          cvId,
          sectionId,
          parsed.data as unknown as Parameters<typeof upsertSection.execute>[2]
        )
        return NextResponse.json(ok(cv))
      } catch (err) {
        return handleCVError(err)
      }
    },
    session.user.id
  )
}

/**
 * DELETE /api/cv/:cvId/sections/:sectionId
 * Elimina una sección del CV.
 * Protección: session + ownership
 * Rate limit: mutation
 */
export async function deleteSectionHandler(
  req: NextRequest,
  cvId: string,
  sectionId: string
): Promise<NextResponse> {
  const cvIdError = validateCVId(cvId)
  if (cvIdError) return cvIdError

  const sectionIdError = validateSectionId(sectionId)
  if (sectionIdError) return sectionIdError

  const { session, error } = await requireSession()
  if (error) return error

  return withRateLimit(
    req,
    "mutation",
    async () => {
      try {
        await conectarBD()
        const { ownerError } = await resolveCVWithOwnership(
          cvId,
          session.user.id
        )
        if (ownerError) return ownerError

        const { deleteSection } = makeCVUseCases()
        const cv = await deleteSection.execute(cvId, sectionId)
        return NextResponse.json(ok(cv))
      } catch (err) {
        return handleCVError(err)
      }
    },
    session.user.id
  )
}

/**
 * PATCH /api/cv/:cvId/sections/reorder
 * Reordena todas las secciones enviando el array completo de IDs en el nuevo orden.
 * Protección: session + ownership
 * Rate limit: mutation
 */
export async function reorderSectionsHandler(
  req: NextRequest,
  cvId: string
): Promise<NextResponse> {
  const idError = validateCVId(cvId)
  if (idError) return idError

  const { session, error } = await requireSession()
  if (error) return error

  return withRateLimit(
    req,
    "mutation",
    async () => {
      try {
        await conectarBD()
        const { ownerError } = await resolveCVWithOwnership(
          cvId,
          session.user.id
        )
        if (ownerError) return ownerError

        const body = await req.json()
        const parsed = reorderSectionsSchema.safeParse(body)
        if (!parsed.success) {
          return NextResponse.json(
            fail("VALIDATION_ERROR", parsed.error.issues[0].message),
            { status: 422 }
          )
        }
        const { reorderSections } = makeCVUseCases()
        const cv = await reorderSections.execute(cvId, parsed.data)
        return NextResponse.json(ok(cv))
      } catch (err) {
        return handleCVError(err)
      }
    },
    session.user.id
  )
}
