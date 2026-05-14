import {
  CreateCVUseCase,
  DeleteCVUseCase,
  DeleteSectionUseCase,
  GetCVUseCase,
  ListCVsByUserUseCase,
  ReorderSectionsUseCase,
  UpdateCVTitleUseCase,
  UpdateDocumentConfigUseCase,
  UpsertSectionUseCase,
} from "@/modules/cv/application"
import { CVNotFoundError, CVSectionNotFoundError } from "@/modules/cv/domain"
import {
  buildCV,
  makeCVRepoMock,
  MOCK_CV_ID,
  MOCK_SECTION_ID,
  MOCK_USER_ID,
} from "@/testing/helpers/mock-factories"
import { beforeEach, describe, expect, it } from "vitest"

// ─── CreateCVUseCase ─────────────────────────────────────────────────────────

describe("CreateCVUseCase", () => {
  let repo: ReturnType<typeof makeCVRepoMock>
  let useCase: CreateCVUseCase

  beforeEach(() => {
    repo = makeCVRepoMock()
    useCase = new CreateCVUseCase(repo)
  })

  it("genera un slug a partir del título", async () => {
    const cv = buildCV()
    repo.create.mockResolvedValue(cv)
    repo.upsertSection.mockResolvedValue(cv)

    await useCase.execute({ userId: MOCK_USER_ID, title: "Mi CV Senior" })

    const [createArg] = repo.create.mock.calls[0]
    expect(createArg.slug).toMatch(/^mi-cv-senior-/)
  })

  it("normaliza acentos en el slug", async () => {
    const cv = buildCV()
    repo.create.mockResolvedValue(cv)
    repo.upsertSection.mockResolvedValue(cv)

    await useCase.execute({ userId: MOCK_USER_ID, title: "Développeur Señor" })

    const [createArg] = repo.create.mock.calls[0]
    expect(createArg.slug).toMatch(/^developpeur-senor-/)
  })

  it("usa slug 'mi-cv' como fallback para título vacío", async () => {
    const cv = buildCV()
    repo.create.mockResolvedValue(cv)
    repo.upsertSection.mockResolvedValue(cv)

    await useCase.execute({ userId: MOCK_USER_ID, title: "   " })

    const [createArg] = repo.create.mock.calls[0]
    expect(createArg.slug).toMatch(/^mi-cv-/)
  })

  it("inserta exactamente 5 secciones por defecto", async () => {
    const cv = buildCV()
    repo.create.mockResolvedValue(cv)
    repo.upsertSection.mockResolvedValue(cv)

    await useCase.execute({ userId: MOCK_USER_ID, title: "Mi CV" })

    expect(repo.upsertSection).toHaveBeenCalledTimes(5)
  })

  it("las secciones por defecto incluyen profile y experience", async () => {
    const cv = buildCV()
    repo.create.mockResolvedValue(cv)
    repo.upsertSection.mockResolvedValue(cv)

    await useCase.execute({ userId: MOCK_USER_ID, title: "Mi CV" })

    const sectionTypes = repo.upsertSection.mock.calls.map(
      (args: any) => (args[2] as { type: string }).type
    )
    expect(sectionTypes).toContain("profile")
    expect(sectionTypes).toContain("experience")
  })
})

// ─── GetCVUseCase ────────────────────────────────────────────────────────────

describe("GetCVUseCase", () => {
  let repo: ReturnType<typeof makeCVRepoMock>
  let useCase: GetCVUseCase

  beforeEach(() => {
    repo = makeCVRepoMock()
    useCase = new GetCVUseCase(repo)
  })

  it("devuelve el CV cuando existe", async () => {
    const cv = buildCV()
    repo.findById.mockResolvedValue(cv)

    const result = await useCase.execute(MOCK_CV_ID)
    expect(result).toEqual(cv)
  })

  it("lanza CVNotFoundError cuando no existe", async () => {
    repo.findById.mockResolvedValue(null)

    await expect(useCase.execute(MOCK_CV_ID)).rejects.toThrow(CVNotFoundError)
  })

  it("lanza CVNotFoundError con statusCode 404", async () => {
    repo.findById.mockResolvedValue(null)

    await expect(useCase.execute(MOCK_CV_ID)).rejects.toMatchObject({
      statusCode: 404,
      code: "CV_NOT_FOUND",
    })
  })
})

// ─── ListCVsByUserUseCase ────────────────────────────────────────────────────

describe("ListCVsByUserUseCase", () => {
  let repo: ReturnType<typeof makeCVRepoMock>
  let useCase: ListCVsByUserUseCase

  beforeEach(() => {
    repo = makeCVRepoMock()
    useCase = new ListCVsByUserUseCase(repo)
  })

  it("devuelve lista vacía si el usuario no tiene CVs", async () => {
    repo.findAllByUserId.mockResolvedValue([])
    const result = await useCase.execute(MOCK_USER_ID)
    expect(result).toEqual([])
  })

  it("devuelve todos los CVs del usuario", async () => {
    const cvs = [buildCV(), buildCV({ id: "otro-id", title: "CV 2" })]
    repo.findAllByUserId.mockResolvedValue(cvs)

    const result = await useCase.execute(MOCK_USER_ID)
    expect(result).toHaveLength(2)
    expect(repo.findAllByUserId).toHaveBeenCalledWith(MOCK_USER_ID)
  })
})

// ─── UpdateCVTitleUseCase ────────────────────────────────────────────────────

describe("UpdateCVTitleUseCase", () => {
  let repo: ReturnType<typeof makeCVRepoMock>
  let useCase: UpdateCVTitleUseCase

  beforeEach(() => {
    repo = makeCVRepoMock()
    useCase = new UpdateCVTitleUseCase(repo)
  })

  it("actualiza el título del CV", async () => {
    const updated = buildCV({ title: "Nuevo Título" })
    repo.findById.mockResolvedValue(buildCV())
    repo.updateTitle.mockResolvedValue(updated)

    const result = await useCase.execute(MOCK_CV_ID, { title: "Nuevo Título" })

    expect(repo.updateTitle).toHaveBeenCalledWith(MOCK_CV_ID, {
      title: "Nuevo Título",
    })
    expect(result.title).toBe("Nuevo Título")
  })

  it("lanza CVNotFoundError si el CV no existe", async () => {
    repo.findById.mockResolvedValue(null)

    await expect(
      useCase.execute(MOCK_CV_ID, { title: "Nuevo" })
    ).rejects.toThrow(CVNotFoundError)

    expect(repo.updateTitle).not.toHaveBeenCalled()
  })
})

// ─── UpdateDocumentConfigUseCase ─────────────────────────────────────────────

describe("UpdateDocumentConfigUseCase", () => {
  let repo: ReturnType<typeof makeCVRepoMock>
  let useCase: UpdateDocumentConfigUseCase

  beforeEach(() => {
    repo = makeCVRepoMock()
    useCase = new UpdateDocumentConfigUseCase(repo)
  })

  it("actualiza la configuración del documento parcialmente", async () => {
    const updated = buildCV({
      documentConfig: {
        templateId: "yale",
        color: "#5B5BD6",
        fontFamily: "DM Sans",
        fontSize: 0,
        language: "PE",
      },
    })
    repo.findById.mockResolvedValue(buildCV())
    repo.updateConfig.mockResolvedValue(updated)

    const result = await useCase.execute(MOCK_CV_ID, {
      templateId: "yale",
      color: "#5B5BD6",
    })

    expect(repo.updateConfig).toHaveBeenCalledWith(MOCK_CV_ID, {
      templateId: "yale",
      color: "#5B5BD6",
    })
    expect(result.documentConfig.templateId).toBe("yale")
  })
})

// ─── DeleteCVUseCase ─────────────────────────────────────────────────────────

describe("DeleteCVUseCase", () => {
  let repo: ReturnType<typeof makeCVRepoMock>
  let useCase: DeleteCVUseCase

  beforeEach(() => {
    repo = makeCVRepoMock()
    useCase = new DeleteCVUseCase(repo)
  })

  it("elimina el CV y retorna los datos del eliminado", async () => {
    const cv = buildCV()
    repo.findById.mockResolvedValue(cv)
    repo.delete.mockResolvedValue(undefined)

    const result = await useCase.execute(MOCK_CV_ID)

    expect(repo.delete).toHaveBeenCalledWith(MOCK_CV_ID)
    expect(result).toEqual(cv)
  })

  it("lanza CVNotFoundError antes de intentar eliminar", async () => {
    repo.findById.mockResolvedValue(null)

    await expect(useCase.execute(MOCK_CV_ID)).rejects.toThrow(CVNotFoundError)
    expect(repo.delete).not.toHaveBeenCalled()
  })
})

// ─── Section Use Cases ───────────────────────────────────────────────────────

describe("UpsertSectionUseCase", () => {
  let repo: ReturnType<typeof makeCVRepoMock>
  let useCase: UpsertSectionUseCase

  beforeEach(() => {
    repo = makeCVRepoMock()
    useCase = new UpsertSectionUseCase(repo)
  })

  it("inserta una sección nueva cuando sectionId es 'new'", async () => {
    repo.findById.mockResolvedValue(buildCV())
    repo.upsertSection.mockResolvedValue(buildCV())

    await useCase.execute(MOCK_CV_ID, "new", {
      type: "skills",
      order: 5,
      visible: true,
      data: { items: [] },
    })

    expect(repo.upsertSection).toHaveBeenCalledWith(
      MOCK_CV_ID,
      "new",
      expect.objectContaining({ type: "skills" })
    )
  })

  it("lanza CVSectionNotFoundError si el sectionId no pertenece al CV", async () => {
    const cv = buildCV({ sections: [] }) // sin secciones
    repo.findById.mockResolvedValue(cv)

    await expect(
      useCase.execute(MOCK_CV_ID, MOCK_SECTION_ID, {
        type: "skills",
        order: 0,
        visible: true,
        data: { items: [] },
      })
    ).rejects.toThrow(CVSectionNotFoundError)
  })

  it("lanza CVNotFoundError si el CV no existe", async () => {
    repo.findById.mockResolvedValue(null)

    await expect(
      useCase.execute(MOCK_CV_ID, "new", {
        type: "skills",
        order: 0,
        visible: true,
        data: { items: [] },
      })
    ).rejects.toThrow(CVNotFoundError)
  })
})

describe("DeleteSectionUseCase", () => {
  let repo: ReturnType<typeof makeCVRepoMock>
  let useCase: DeleteSectionUseCase

  beforeEach(() => {
    repo = makeCVRepoMock()
    useCase = new DeleteSectionUseCase(repo)
  })

  it("elimina la sección cuando existe en el CV", async () => {
    const cv = buildCV({
      sections: [
        {
          id: MOCK_SECTION_ID,
          type: "skills",
          order: 0,
          visible: true,
          data: { items: [] },
        },
      ],
    })
    repo.findById.mockResolvedValue(cv)
    repo.deleteSection.mockResolvedValue(buildCV())

    await useCase.execute(MOCK_CV_ID, MOCK_SECTION_ID)

    expect(repo.deleteSection).toHaveBeenCalledWith(MOCK_CV_ID, MOCK_SECTION_ID)
  })

  it("lanza CVSectionNotFoundError si la sección no existe", async () => {
    repo.findById.mockResolvedValue(buildCV({ sections: [] }))

    await expect(useCase.execute(MOCK_CV_ID, MOCK_SECTION_ID)).rejects.toThrow(
      CVSectionNotFoundError
    )
  })
})

describe("ReorderSectionsUseCase", () => {
  let repo: ReturnType<typeof makeCVRepoMock>
  let useCase: ReorderSectionsUseCase

  beforeEach(() => {
    repo = makeCVRepoMock()
    useCase = new ReorderSectionsUseCase(repo)
  })

  it("reordena las secciones cuando los IDs son válidos", async () => {
    const cv = buildCV()
    repo.findById.mockResolvedValue(cv)
    repo.reorderSections.mockResolvedValue(cv)

    await useCase.execute(MOCK_CV_ID, {
      orderedIds: [MOCK_SECTION_ID],
    })

    expect(repo.reorderSections).toHaveBeenCalledWith(MOCK_CV_ID, {
      orderedIds: [MOCK_SECTION_ID],
    })
  })

  it("lanza CVNotFoundError si el CV no existe", async () => {
    repo.findById.mockResolvedValue(null)

    await expect(
      useCase.execute(MOCK_CV_ID, { orderedIds: [MOCK_SECTION_ID] })
    ).rejects.toThrow(CVNotFoundError)
  })
})
