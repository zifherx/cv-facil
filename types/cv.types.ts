import { TEMPLATES_CV } from "../lib/constants/cv.constants"

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

export interface ICVTemplate {
  id: string
  label: string
  color: string
}

export type TemplateIdType = (typeof TEMPLATES_CV)[number]["id"]

export type TEMPLATE_MINI_CARD_PROPS = {
  template: (typeof TEMPLATES_CV)[number]
  selected: boolean
  onSelect: () => void
}

export type CV_MINI_PREVIEW_PROPS = {
  color: string
}

export type CV_CARD_PROPS = {
  cv: CV
  onDelete: (cv: CV) => void
}

export type CV_DELETE_DIALOG_PROPS = {
  cv: CV | null
  onClose: () => void
}
