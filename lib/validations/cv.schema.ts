import z from "zod/v3"

export const createCVSchema = z.object({
  title: z.string().min(1, "El título es requerido").max(120).trim(),
})

export const documentConfigSchema = z.object({
  templateId: z
    .enum(["erasmus", "hopkins", "yale", "oxford", "cambridge"])
    .optional(),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .optional(),
  fontFamily: z.string().optional(),
  fontSize: z.number().int().min(-50).max(50).optional(),
  language: z.string().optional(),
})

export type CreateCVFormValues = z.infer<typeof createCVSchema>
export type DocumentConfigFormValues = z.infer<typeof documentConfigSchema>
