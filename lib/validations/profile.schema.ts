import z from "zod"

export const profileSchema = z.object({
  firstName: z.string().min(1, "El nombre es requerido").max(80).trim(),
  lastName: z.string().min(1, "El apellido es requerido").max(80).trim(),
  email: z.string().email("Email inválido"),
  phone: z.string().max(30).optional(),
  address: z
    .object({
      street: z.string().max(200).optional(),
      city: z.string().max(100).optional(),
      postalCode: z.string().max(20).optional(),
      country: z.string().length(2, "Código ISO de 2 letras").optional(),
    })
    .optional(),
})

export type ProfileFormValues = z.infer<typeof profileSchema>
