import {
  CV,
  CVNotFoundError,
  ICVRepository,
  UpdateCVTitleDTO,
  UpdateDocumentConfigDTO,
} from "@/modules/cv/domain"

export class UpdateCVTitleUseCase {
  constructor(private readonly cvRepository: ICVRepository) {}

  async execute(cvId: string, data: UpdateCVTitleDTO): Promise<CV> {
    const existing = await this.cvRepository.findById(cvId)
    if (!existing) throw new CVNotFoundError(cvId)

    return this.cvRepository.updateTitle(cvId, data)
  }
}

export class UpdateDocumentConfigUseCase {
  constructor(private readonly cvRepository: ICVRepository) {}

  async execute(cvId: string, data: UpdateDocumentConfigDTO): Promise<CV> {
    const existing = await this.cvRepository.findById(cvId)
    if (!existing) throw new CVNotFoundError(cvId)

    return this.cvRepository.updateConfig(cvId, data)
  }
}
