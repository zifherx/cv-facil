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
import { MongoCVRepository } from "@/modules/cv/infrastructure"

export const makeCVUseCases = () => {
  const repo = new MongoCVRepository()
  return {
    createCV: new CreateCVUseCase(repo),
    getCV: new GetCVUseCase(repo),
    listCVs: new ListCVsByUserUseCase(repo),
    updateTitle: new UpdateCVTitleUseCase(repo),
    updateConfig: new UpdateDocumentConfigUseCase(repo),
    deleteCV: new DeleteCVUseCase(repo),
    upsertSection: new UpsertSectionUseCase(repo),
    deleteSection: new DeleteSectionUseCase(repo),
    reorderSections: new ReorderSectionsUseCase(repo),
    repo,
  }
}
