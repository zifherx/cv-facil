import {
  deleteUserHandler,
  getUserByIdHandler,
} from "@/modules/user/presentation/UserController"
import { PARAMS_USER_ROUTE } from "@/shared/types"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest, { params }: PARAMS_USER_ROUTE) {
  const { id } = await params
  return getUserByIdHandler(req, id)
}

export async function DELETE(req: NextRequest, { params }: PARAMS_USER_ROUTE) {
  const { id } = await params
  return deleteUserHandler(req, id)
}
