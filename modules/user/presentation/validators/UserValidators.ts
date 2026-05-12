import { z } from "zod"

export const createUserSchema = z.object({
  email: z.email("Email inválido"),
  password: z
    .string()
    .min(8, "La contraseña debe tener mínimo 8 caracteres")
    .regex(/[A-Z]/, "La contraseña debe contener al menos una mayúscula")
    .regex(/[0-9]/, "La contraseña debe contener al menos un número"),
})

export const changeEmailSchema = z.object({
  newEmail: z.email("Email inválido"),
  currentPassword: z.string().min(1, "La contraseña actual es requerida"),
})

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "La contraseña actual es requerida"),
    newPassword: z
      .string()
      .min(8, "La nueva contraseña debe tener mínimo 8 caracteres")
      .regex(
        /[A-Z]/,
        "La nueva contraseña debe contener al menos una mayúscula"
      )
      .regex(/[0-9]/, "La nuevacontraseña debe contener al menos un número"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })

export const getByEmailSchema = z.object({
  email: z.email("Email inválido"),
})
