import { updateAvatarHandler } from "@/modules/profile/presentation/ProfileController"
import { PARAMS_PROFILE_ROUTE } from "@/shared/types"
import { NextRequest } from "next/server"

export async function PATCH(
  req: NextRequest,
  { params }: PARAMS_PROFILE_ROUTE
) {
  const { userId } = await params
  return updateAvatarHandler(req, userId)
}
