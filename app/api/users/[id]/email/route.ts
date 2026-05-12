import { changeEmailHandler } from "@/modules/user/presentation/UserController"
import { PARAMS_USER_ROUTE } from "@/shared/types"
import { NextRequest } from "next/server"

export async function PATCH(req: NextRequest, { params }: PARAMS_USER_ROUTE) {
  const { id } = await params
  return changeEmailHandler(req, id)
}
