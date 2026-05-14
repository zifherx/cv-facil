import { slugify } from "@/lib"
import {
  CreateCVDTO,
  CV,
  CVSection,
  ICVRepository,
  SectionData,
} from "@/modules/cv/domain"

function buildDefaultSections(): Omit<CVSection, "id">[] {
  return [
    {
      type: "profile",
      order: 0,
      visible: true,
      data: { text: "" } as SectionData,
    },
    {
      type: "experience",
      order: 1,
      visible: true,
      data: { items: [] } as SectionData,
    },
    {
      type: "education",
      order: 2,
      visible: true,
      data: { items: [] } as SectionData,
    },
    {
      type: "technical_skills",
      order: 3,
      visible: true,
      data: { items: [] } as SectionData,
    },
    {
      type: "languages",
      order: 4,
      visible: true,
      data: { items: [] } as SectionData,
    },
  ]
}

export class CreateCVUseCase {
  constructor(private readonly cvRepository: ICVRepository) {}

  async execute(data: CreateCVDTO): Promise<CV> {
    const baseSlug = slugify(data.title) || "mi-cv"
    // Suffix with short timestamp to guarantee uniqueness per user
    const slug = `${baseSlug}-${Date.now().toString(36)}`

    const cv = await this.cvRepository.create({ ...data, slug })

    // Upsert default sections after creation
    let updatedCV = cv
    for (const section of buildDefaultSections()) {
      updatedCV = await this.cvRepository.upsertSection(
        cv.id,
        "new",
        section as Parameters<ICVRepository["upsertSection"]>[2]
      )
    }

    return updatedCV
  }
}
