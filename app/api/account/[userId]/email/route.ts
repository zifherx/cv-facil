import { changeAccountEmailHandler } from "@/modules/account/presentation"
import { PARAMS_ACCOUNT_ROUTE } from "@/shared/types/account.types"
import { NextRequest } from "next/server"

/**
 * PATCH /api/account/:userId/email
 * Body: { newEmail: string }
 * Returns: Account (200) | 400 | 404 | 409 | 422 | 500
 */
export async function PATCH(
  req: NextRequest,
  { params }: PARAMS_ACCOUNT_ROUTE
) {
  const { userId } = await params
  return changeAccountEmailHandler(req, userId)
}
