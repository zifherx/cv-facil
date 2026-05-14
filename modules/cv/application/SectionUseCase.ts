import {
  CV,
  CVNotFoundError,
  CVSectionNotFoundError,
  ICVRepository,
  ReorderSectionsDTO,
  UpsertSectionDTO,
} from "@/modules/cv/domain"

export class UpsertSectionUseCase {
  constructor(private readonly cvRepository: ICVRepository) {}

  async execute(
    cvId: string,
    sectionId: string,
    data: UpsertSectionDTO
  ): Promise<CV> {
    const existing = await this.cvRepository.findById(cvId)
    if (!existing) throw new CVNotFoundError(cvId)

    // When updating an existing section, verify it belongs to this CV
    if (sectionId !== "new") {
      const sectionExists = existing.sections.some((s) => s.id === sectionId)
      if (!sectionExists) throw new CVSectionNotFoundError(sectionId)
    }

    return this.cvRepository.upsertSection(cvId, sectionId, data)
  }
}

export class DeleteSectionUseCase {
  constructor(private readonly cvRepository: ICVRepository) {}

  async execute(cvId: string, sectionId: string): Promise<CV> {
    const existing = await this.cvRepository.findById(cvId)
    if (!existing) throw new CVNotFoundError(cvId)

    const sectionExists = existing.sections.some((s) => s.id === sectionId)
    if (!sectionExists) throw new CVSectionNotFoundError(sectionId)

    return this.cvRepository.deleteSection(cvId, sectionId)
  }
}

export class ReorderSectionsUseCase {
  constructor(private readonly cvRepository: ICVRepository) {}

  async execute(cvId: string, data: ReorderSectionsDTO): Promise<CV> {
    const existing = await this.cvRepository.findById(cvId)
    if (!existing) throw new CVNotFoundError(cvId)

    return this.cvRepository.reorderSections(cvId, data)
  }
}
