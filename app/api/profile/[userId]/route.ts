import {
  deleteProfileHandler,
  getProfileHandler,
  updateProfileHandler,
} from "@/modules/profile/presentation/ProfileController"
import { PARAMS_PROFILE_ROUTE } from "@/shared/types"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest, { params }: PARAMS_PROFILE_ROUTE) {
  const { userId } = await params
  return getProfileHandler(req, userId)
}

export async function PATCH(
  req: NextRequest,
  { params }: PARAMS_PROFILE_ROUTE
) {
  const { userId } = await params
  return updateProfileHandler(req, userId)
}

export async function DELETE(
  req: NextRequest,
  { params }: PARAMS_PROFILE_ROUTE
) {
  const { userId } = await params
  return deleteProfileHandler(req, userId)
}
