import {
  CV,
  CVNotFoundError,
  CVSectionNotFoundError,
  CVSectionOrderConflictError,
  CreateCVDTO,
  ICVRepository,
  ReorderSectionsDTO,
  UpdateCVTitleDTO,
  UpdateDocumentConfigDTO,
  UpsertSectionDTO,
} from "@/modules/cv/domain"
import { CVModel, ICVDocument } from "@/modules/cv/infrastructure"
import { Types } from "mongoose"

export class MongoCVRepository implements ICVRepository {
  // ─── Domain mapper ──────────────────────────────────────────────────────────
  private toDomain(doc: ICVDocument): CV {
    return {
      id: doc._id.toString(),
      userId: doc.userId.toString(),
      title: doc.title,
      slug: doc.slug,
      sections: doc.sections.map((s) => ({
        id: s._id.toString(),
        type: s.type as CV["sections"][number]["type"],
        order: s.order,
        visible: s.visible,
        data: s.data as unknown as CV["sections"][number]["data"],
      })),
      documentConfig: {
        templateId: doc.documentConfig
          .templateId as CV["documentConfig"]["templateId"],
        color: doc.documentConfig.color,
        fontFamily: doc.documentConfig.fontFamily,
        fontSize: doc.documentConfig.fontSize,
        language: doc.documentConfig.language,
      },
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }
  }

  // ─── Queries ────────────────────────────────────────────────────────────────
  async findById(id: string): Promise<CV | null> {
    const doc = await CVModel.findById(id)
    return doc ? this.toDomain(doc) : null
  }

  async findAllByUserId(userId: string): Promise<CV[]> {
    const docs = await CVModel.find({ userId }).sort({ updatedAt: -1 })
    return docs.map((d) => this.toDomain(d))
  }

  // ─── CV commands ────────────────────────────────────────────────────────────
  async create(data: CreateCVDTO & { slug: string }): Promise<CV> {
    const doc = await CVModel.create({
      userId: data.userId,
      title: data.title,
      slug: data.slug,
    })
    return this.toDomain(doc)
  }

  async updateTitle(id: string, data: UpdateCVTitleDTO): Promise<CV> {
    const doc = await CVModel.findByIdAndUpdate(
      id,
      { $set: { title: data.title } },
      { after: true, runValidators: true }
    )
    if (!doc) throw new CVNotFoundError(id)
    return this.toDomain(doc)
  }

  async updateConfig(id: string, data: UpdateDocumentConfigDTO): Promise<CV> {
    // Flat $set to allow partial config updates without wiping untouched fields
    const flatUpdate: Record<string, unknown> = {}
    if (data.templateId !== undefined)
      flatUpdate["documentConfig.templateId"] = data.templateId
    if (data.color !== undefined)
      flatUpdate["documentConfig.color"] = data.color
    if (data.fontFamily !== undefined)
      flatUpdate["documentConfig.fontFamily"] = data.fontFamily
    if (data.fontSize !== undefined)
      flatUpdate["documentConfig.fontSize"] = data.fontSize
    if (data.language !== undefined)
      flatUpdate["documentConfig.language"] = data.language

    const doc = await CVModel.findByIdAndUpdate(
      id,
      { $set: flatUpdate },
      { after: true, runValidators: true }
    )
    if (!doc) throw new CVNotFoundError(id)
    return this.toDomain(doc)
  }

  async delete(id: string): Promise<void> {
    await CVModel.findByIdAndDelete(id)
  }

  // ─── Section commands ────────────────────────────────────────────────────────

  /**
   * Upsert: si sectionId existe → actualiza, si no → inserta como nueva.
   * Permite al frontend crear secciones con IDs generados en cliente (UUID)
   * o dejar que el backend asigne uno nuevo cuando sectionId = "new".
   */
  async upsertSection(
    cvId: string,
    sectionId: string,
    data: UpsertSectionDTO
  ): Promise<CV> {
    const doc = await CVModel.findById(cvId)
    if (!doc) throw new CVNotFoundError(cvId)

    const isNew = sectionId === "new"
    const existing = isNew
      ? null
      : doc.sections.find((s) => s._id.toString() === sectionId)

    if (existing) {
      // Update in-place
      existing.type = data.type
      existing.order = data.order
      existing.visible = data.visible
      existing.data = data.data as unknown as Record<string, unknown>
    } else {
      // Insert — assign a new ObjectId-compatible id
      doc.sections.push({
        _id: new Types.ObjectId(),
        type: data.type,
        order: data.order,
        visible: data.visible,
        data: data.data as unknown as Record<string, unknown>,
      })
    }

    await doc.save()
    return this.toDomain(doc)
  }

  async deleteSection(cvId: string, sectionId: string): Promise<CV> {
    const doc = await CVModel.findById(cvId)
    if (!doc) throw new CVNotFoundError(cvId)

    const idx = doc.sections.findIndex((s) => s._id.toString() === sectionId)
    if (idx === -1) throw new CVSectionNotFoundError(sectionId)

    doc.sections.splice(idx, 1)
    await doc.save()
    return this.toDomain(doc)
  }

  async reorderSections(cvId: string, data: ReorderSectionsDTO): Promise<CV> {
    const doc = await CVModel.findById(cvId)
    if (!doc) throw new CVNotFoundError(cvId)

    const existingIds = new Set(doc.sections.map((s) => s._id.toString()))

    // Validate: orderedIds must be exactly the current section IDs
    const allPresent =
      data.orderedIds.length === existingIds.size &&
      data.orderedIds.every((id) => existingIds.has(id))

    if (!allPresent) throw new CVSectionOrderConflictError()

    // Apply new order via the order field
    data.orderedIds.forEach((id, index) => {
      const section = doc.sections.find((s) => s._id.toString() === id)!
      section.order = index
    })

    await doc.save()
    return this.toDomain(doc)
  }
}
