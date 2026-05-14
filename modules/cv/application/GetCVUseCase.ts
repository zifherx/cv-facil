import { CV, CVNotFoundError, ICVRepository } from "@/modules/cv/domain"

export class GetCVUseCase {
  constructor(private readonly cvRepository: ICVRepository) {}

  async execute(id: string): Promise<CV> {
    const cv = await this.cvRepository.findById(id)
    if (!cv) throw new CVNotFoundError(id)
    return cv
  }
}

export class ListCVsByUserUseCase {
  constructor(private readonly cvRepository: ICVRepository) {}

  async execute(userId: string): Promise<CV[]> {
    return this.cvRepository.findAllByUserId(userId)
  }
}
