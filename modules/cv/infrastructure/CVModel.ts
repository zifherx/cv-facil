import { SectionType, TemplateId } from "@/modules/cv/domain"
import { Document, model, Model, models, Schema, Types } from "mongoose"

// ─── Sub-schemas ──────────────────────────────────────────────────────────────

const DocumentConfigSchema = new Schema(
  {
    templateId: {
      type: String,
      enum: [
        "erasmus",
        "hopkins",
        "yale",
        "oxford",
        "cambridge",
      ] satisfies TemplateId[],
      default: "erasmus",
    },
    color: { type: String, default: "#E84C3D" },
    fontFamily: { type: String, default: "DM Sans" },
    fontSize: { type: Number, default: 0, min: -50, max: 50 },
    language: { type: String, default: "PE" },
  },
  { _id: false, versionKey: false }
)

/**
 * Section data is intentionally Schema.Types.Mixed.
 * Each section type has a different shape — keeping it schemaless in Mongo
 * lets us add new section types without schema migrations.
 * Type safety lives in the domain layer (CV.entity.ts).
 */
const SectionSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: [
        "profile",
        "experience",
        "education",
        "skills",
        "technical_skills",
        "languages",
        "certifications",
        "courses",
        "custom_text",
        "custom_list",
        "custom_experience",
      ] satisfies SectionType[],
    },
    order: { type: Number, required: true },
    visible: { type: Boolean, default: true },
    data: { type: Schema.Types.Mixed, default: {} },
  },
  { versionKey: false }
)

// ─── Document interface ───────────────────────────────────────────────────────

export interface ICVDocument extends Document {
  userId: Types.ObjectId
  title: string
  slug: string
  sections: Types.DocumentArray<{
    _id: Types.ObjectId
    type: string
    order: number
    visible: boolean
    data: Record<string, unknown>
  }>
  documentConfig: {
    templateId: string
    color: string
    fontFamily: string
    fontSize: number
    language: string
  }
  createdAt: Date
  updatedAt: Date
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const CVSchema = new Schema<ICVDocument>(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true, default: "Mi CV" },
    slug: { type: String, required: true, trim: true },
    sections: { type: [SectionSchema], default: [] },
    documentConfig: { type: DocumentConfigSchema, default: () => ({}) },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "cvs",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

// Compound unique index: un usuario no puede tener dos CVs con el mismo slug
CVSchema.index({ userId: 1, slug: 1 }, { unique: true })

// ─── Model ────────────────────────────────────────────────────────────────────

export const CVModel: Model<ICVDocument> =
  models.CV ?? model<ICVDocument>("CV", CVSchema)
