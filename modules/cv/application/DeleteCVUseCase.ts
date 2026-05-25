import { CV, CVNotFoundError, ICVRepository } from "@/modules/cv/domain"

export class DeleteCVUseCase {
  constructor(private readonly cvRepository: ICVRepository) {}

  async execute(cvId: string): Promise<CV> {
    const existing = await this.cvRepository.findById(cvId)
    if (!existing) throw new CVNotFoundError(cvId)

    await this.cvRepository.delete(cvId)
    return existing
  }
}
