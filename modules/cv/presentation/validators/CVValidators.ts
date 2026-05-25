import { mongoIdSchema } from "@/shared/schemas"
import z from "zod"

// ─── CV base ──────────────────────────────────────────────────────────────────

export const createCVSchema = z.object({
  userId: mongoIdSchema,
  title: z.string().min(1, "El título es requerido").max(120).trim(),
})

export const updateCVTitleSchema = z.object({
  title: z.string().min(1, "El título es requerido").max(120).trim(),
})

// ─── Document config ──────────────────────────────────────────────────────────

export const updateDocumentConfigSchema = z
  .object({
    templateId: z
      .enum(["erasmus", "hopkins", "yale", "oxford", "cambridge"])
      .optional(),
    color: z
      .string()
      .regex(/^#[0-9A-Fa-f]{6}$/, "Color debe ser un hex válido (#RRGGBB)")
      .optional(),
    fontFamily: z.string().min(1).max(60).optional(),
    fontSize: z.number().int().min(0).max(50).optional(),
    language: z.string().min(2).max(5).optional(),
  })
  .refine((data) => Object.values(data).some((v) => v !== undefined), {
    message: "Debe enviar al menos un campo de configuración",
  })

// ─── Section data schemas (one per type) ──────────────────────────────────────

const experienceItemSchema = z.object({
  id: z.string().min(1),
  jobTitle: z.string().min(1, "El cargo es requerido").max(120),
  company: z.string().min(1, "La empresa es requerida").max(120),
  location: z.string().max(120).optional().default(""),
  startDate: z.string().regex(/^\d{4}-\d{2}$/, "Formato de fecha: YYYY-MM"),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}$/)
    .nullable()
    .default(null),
  isCurrent: z.boolean().default(false),
  description: z.string().max(5000).optional().default(""),
})

const educationItemSchema = z.object({
  id: z.string().min(1),
  degree: z.string().min(1, "El título académico es requerido").max(120),
  institution: z.string().min(1, "La institución es requerida").max(120),
  startDate: z.string().regex(/^\d{4}-\d{2}$/, "Formato de fecha: YYYY-MM"),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}$/)
    .nullable()
    .default(null),
  isCurrent: z.boolean().default(false),
  description: z.string().max(2000).optional().default(""),
})

const skillLevels = ["Básico", "Hábil", "Experimentado", "Experto"] as const
const skillItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, "El nombre de la habilidad es requerido").max(80),
  level: z.enum(skillLevels),
})

const languageItemSchema = z.object({
  id: z.string().min(1),
  language: z.string().min(1, "El idioma es requerido").max(60),
  level: z.string().min(1, "El nivel es requerido").max(20),
})

const certificationItemSchema = z.object({
  id: z.string().min(1),
  name: z
    .string()
    .min(1, "El nombre de la certificación es requerido")
    .max(200),
  issuer: z.string().max(120).optional().default(""),
  year: z.string().max(4).optional().default(""),
})

const courseItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, "El nombre del curso es requerido").max(200),
  institution: z.string().max(120).optional().default(""),
  startDate: z.string().regex(/^\d{4}-\d{2}$/, "Formato de fecha: YYYY-MM"),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}$/)
    .nullable()
    .default(null),
})

const customListItemSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1).max(300),
})

// Map each SectionType to its data validator
const sectionDataByType = {
  profile: z.object({ text: z.string().max(2000).default("") }),
  experience: z.object({ items: z.array(experienceItemSchema) }),
  education: z.object({ items: z.array(educationItemSchema) }),
  skills: z.object({ items: z.array(skillItemSchema) }),
  technical_skills: z.object({ items: z.array(skillItemSchema) }),
  languages: z.object({ items: z.array(languageItemSchema) }),
  certifications: z.object({ items: z.array(certificationItemSchema) }),
  courses: z.object({ items: z.array(courseItemSchema) }),
  custom_text: z.object({
    title: z.string().max(80).default(""),
    text: z.string().max(3000).default(""),
  }),
  custom_list: z.object({
    title: z.string().max(80).default(""),
    items: z.array(customListItemSchema),
  }),
  custom_experience: z.object({ items: z.array(experienceItemSchema) }),
} as const

// ─── Upsert section ───────────────────────────────────────────────────────────

/**
 * Validates section type and then validates data against the
 * corresponding schema using a discriminated approach.
 */
export const upsertSectionSchema = z
  .object({
    type: z.enum(
      Object.keys(sectionDataByType) as [
        keyof typeof sectionDataByType,
        ...Array<keyof typeof sectionDataByType>,
      ]
    ),
    order: z.number().int().min(0),
    visible: z.boolean().default(true),
    data: z.unknown(), // pre-validation — refined below
  })
  .superRefine((val, ctx) => {
    if (
      typeof val.data !== "object" ||
      val.data === null ||
      Array.isArray(val.data)
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["data"],
        message: "data debe ser un objeto",
      })
      return
    }

    const typeKey = val.type as keyof typeof sectionDataByType
    const dataSchema = sectionDataByType[typeKey]
    const result = dataSchema.safeParse(val.data)

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        ctx.addIssue({ ...issue, path: ["data", ...issue.path] })
      })
    }
  })

export type UpsertSectionInput = z.infer<typeof upsertSectionSchema>

// ─── Reorder sections ─────────────────────────────────────────────────────────

export const reorderSectionsSchema = z.object({
  orderedIds: z.array(mongoIdSchema).min(1, "orderedIds no puede estar vacío"),
})
