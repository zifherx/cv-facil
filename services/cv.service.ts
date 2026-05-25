import { del, get, patch, post, put } from "@/lib"
import type {
  CreateCVDTO,
  CV,
  ReorderSectionsDTO,
  UpdateCVTitleDTO,
  UpdateDocumentConfigDTO,
  UpsertSectionDTO,
} from "@/types"

interface HTTP_DELETE_INTERFACE {
  message: string
  deleted: CV
}

export const cvService = {
  list: () => get<CV[]>("/cv"),
  get: (cvId: string) => get<CV>(`/cv/${cvId}`),
  create: (data: CreateCVDTO) => post<CV>("/cv", data),
  updateTitle: (cvId: string, data: UpdateCVTitleDTO) =>
    patch<CV>(`/cv/${cvId}`, data),
  updateConfig: (cvId: string, data: UpdateDocumentConfigDTO) =>
    patch<CV>(`/cv/${cvId}/config`, data),
  delete: (cvId: string) => del<HTTP_DELETE_INTERFACE>(`/cv/${cvId}`),
  upsertSection: (cvId: string, sectionId: string, data: UpsertSectionDTO) =>
    put<CV>(`/cv/${cvId}/sections/${sectionId}`, data),
  deleteSection: (cvId: string, sectionId: string) =>
    del<CV>(`/cv/${cvId}/sections/${sectionId}`),
  reorderSections: (cvId: string, data: ReorderSectionsDTO) =>
    patch<CV>(`/cv/${cvId}/sections/reorder`, data),
}
