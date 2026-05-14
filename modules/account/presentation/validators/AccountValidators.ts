import { mongoIdSchema } from "@/shared/schemas"
import z from "zod"

// ─── Create ───────────────────────────────────────────────────────────────────

export const createAccountSchema = z.object({
  userId: mongoIdSchema,
  email: z.string().email("Email inválido"),
  notificationPreferences: z
    .object({
      messages: z.boolean().optional(),
      jobAlerts: z.boolean().optional(),
      newsletter: z.boolean().optional(),
      offersAndRecommendations: z.boolean().optional(),
    })
    .optional(),
})

// ─── Change email ─────────────────────────────────────────────────────────────

export const changeAccountEmailSchema = z.object({
  newEmail: z.string().email("El nuevo email es inválido"),
})

// ─── Notification preferences ─────────────────────────────────────────────────

/**
 * Permite togglear cualquier combinación de preferencias en una sola llamada.
 * Valida que al menos un campo sea enviado.
 */
export const updateNotificationPrefsSchema = z
  .object({
    messages: z.boolean().optional(),
    jobAlerts: z.boolean().optional(),
    newsletter: z.boolean().optional(),
    offersAndRecommendations: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Debe enviar al menos una preferencia para actualizar",
  })
