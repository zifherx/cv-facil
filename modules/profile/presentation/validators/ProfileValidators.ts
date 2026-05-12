import { mongoIdSchema } from "@/shared/schemas/shared.schema"
import z from "zod"

// ─── Address sub-schema (reusable) ────────────────────────────────────────────

const addressSchema = z
  .object({
    street: z.string().max(200).optional(),
    city: z.string().max(100).optional(),
    postalCode: z.string().max(20).optional(),
    country: z
      .string()
      .length(2, "El país debe ser un código ISO de 2 letras")
      .optional(),
  })
  .optional()

// ─── Schemas ──────────────────────────────────────────────────────────────────

export const createProfileSchema = z.object({
  userId: mongoIdSchema,
  firstName: z.string().min(1, "El nombre es requerido").max(80).trim(),
  lastName: z.string().min(1, "El apellido es requerido").max(80).trim(),
  email: z.email("Email inválido"),
  phone: z.string().max(30).optional(),
  avatarUrl: z.string().url("URL de avatar inválida").nullable().optional(),
  address: addressSchema,
})

export const updateProfileSchema = z
  .object({
    firstName: z.string().min(1).max(80).trim().optional(),
    lastName: z.string().min(1).max(80).trim().optional(),
    email: z.email("Email inválido").optional(),
    phone: z.string().max(30).optional(),
    address: addressSchema,
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Debe enviar al menos un campo para actualizar",
  })

export const updateAvatarSchema = z.object({
  // null permite eliminar el avatar (Cambiar → null, Eliminar → null explícito)
  avatarUrl: z.url("URL de avatar inválida").nullable(),
})
