export type TemplateId = "erasmus" | "hopkins" | "yale" | "oxford" | "cambridge"

export interface DocumentConfig {
  templateId: TemplateId
  color: string
  fontFamily: string
  fontSize: number
  language: string
}

export interface CVSection {
  id: string
  type: string
  order: number
  visible: boolean
  data: Record<string, unknown>
}

export interface CV {
  id: string
  userId: string
  title: string
  slug: string
  sections: CVSection[]
  documentConfig: DocumentConfig
  createdAt: string
  updatedAt: string
}

export type CreateCVDTO = { title: string }
export type UpdateCVTitleDTO = { title: string }
export type UpdateDocumentConfigDTO = Partial<DocumentConfig>

export type UpsertSectionDTO = {
  type: string
  order: number
  visible: boolean
  data: Record<string, unknown>
}

export type ReorderSectionsDTO = { orderedIds: string[] }
