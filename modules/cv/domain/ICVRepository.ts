import {
  CreateCVDTO,
  CV,
  ReorderSectionsDTO,
  UpdateCVTitleDTO,
  UpdateDocumentConfigDTO,
  UpsertSectionDTO,
} from "@/modules/cv/domain"

export interface ICVRepository {
  // ─── Queries ────────────────────────────────────────────────────────────────
  findById(id: string): Promise<CV | null>
  findAllByUserId(userId: string): Promise<CV[]>

  // ─── CV commands ────────────────────────────────────────────────────────────
  create(data: CreateCVDTO & { slug: string }): Promise<CV>
  updateTitle(id: string, data: UpdateCVTitleDTO): Promise<CV>
  updateConfig(id: string, data: UpdateDocumentConfigDTO): Promise<CV>
  delete(id: string): Promise<void>

  // ─── Section commands ────────────────────────────────────────────────────────
  upsertSection(
    cvId: string,
    sectionId: string,
    data: UpsertSectionDTO
  ): Promise<CV>
  deleteSection(cvId: string, sectionId: string): Promise<CV>
  reorderSections(cvId: string, data: ReorderSectionsDTO): Promise<CV>
}
