import z from "zod/v3"

export const changeEmailSchema = z.object({
  newEmail: z.string().min(1, "El email es requerido").email("Email inválido"),
})

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "La contraseña actual es requerida"),
    newPassword: z
      .string()
      .min(8, "Mínimo 8 caracteres")
      .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
      .regex(/[0-9]/, "Debe contener al menos un número"),
    confirmPassword: z.string().min(1, "Confirma tu nueva contraseña"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })

export const notificationPrefsSchema = z.object({
  messages: z.boolean(),
  jobAlerts: z.boolean(),
  newsletter: z.boolean(),
  offersAndRecommendations: z.boolean(),
})

export type ChangeEmailFormValues = z.infer<typeof changeEmailSchema>
export type ChangePassworFormValues = z.infer<typeof changePasswordSchema>
export type NotificationPrefsFormValues = z.infer<
  typeof notificationPrefsSchema
>
