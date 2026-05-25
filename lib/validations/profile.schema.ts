import z from "zod/v3"

export const addressSchema = z.object({
  street: z.string().max(200).optional(),
  city: z.string().max(100).optional(),
  postalCode: z.string().max(20).optional(),
  country: z
    .string()
    .length(2, "Debe ser un código ISO de 2 letras (Ej: PE")
    .toUpperCase()
    .optional()
    .or(z.literal("")),
})

export const profileSchema = z.object({
  firstName: z.string().min(1, "El nombre es requerido").max(80).trim(),
  lastName: z.string().min(1, "El apellido es requerido").max(80).trim(),
  phone: z.string().max(30).optional(),
  // email: z.string(),
  // address: addressSchema,
})

export type AddressFormValues = z.infer<typeof addressSchema>
export type ProfileFormValues = z.infer<typeof profileSchema>
