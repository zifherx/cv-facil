import z from "zod"

export const mongoIdSchema = z
  .string()
  .regex(
    /^[a-f\d]{24}$/i,
    "ID inválido: debe ser un ObjectId de MongoDB válido"
  )
