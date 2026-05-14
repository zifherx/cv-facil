import {
  deleteAccountHandler,
  getAccountHandler,
} from "@/modules/account/presentation"
import { PARAMS_ACCOUNT_ROUTE } from "@/shared/types/account.types"
import { NextRequest } from "next/server"

/**
 * GET /api/account/:userId
 * Returns: Account (200) | 400 | 404 | 500
 */
export async function GET(req: NextRequest, { params }: PARAMS_ACCOUNT_ROUTE) {
  const { userId } = await params
  return getAccountHandler(req, userId)
}

/**
 * DELETE /api/account/:userId
 * Verifica existencia y devuelve mensaje confirmatorio.
 * Returns: { message, deleted: Account } (200) | 400 | 404 | 500
 */
export async function DELETE(
  req: NextRequest,
  { params }: PARAMS_ACCOUNT_ROUTE
) {
  const { userId } = await params
  return deleteAccountHandler(req, userId)
}
