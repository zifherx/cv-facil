import z from "zod"

export const changeEmailSchema = z.object({
  newEmail: z.string().email("Email inválido"),
})

export type ChangeEmailFormValues = z.infer<typeof changeEmailSchema>
