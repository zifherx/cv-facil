import { mongoIdSchema } from "@/shared/schemas"
import z from "zod"

export const listUsersSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
})

export const changeRoleSchema = z.object({
  role: z.enum(["user", "admin"], {
    message: "El rol debe ser 'user' o 'admin'",
  }),
})

export { mongoIdSchema }
