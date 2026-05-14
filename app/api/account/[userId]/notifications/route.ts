import { updateNotificationPrefsHandler } from "@/modules/account/presentation"
import { PARAMS_ACCOUNT_ROUTE } from "@/shared/types/account.types"
import { NextRequest } from "next/server"

/**
 * PATCH /api/account/:userId/notifications
 * Body: { messages?: boolean, jobAlerts?: boolean, newsletter?: boolean, offersAndRecommendations?: boolean }
 * Enviar solo los toggles que cambian — los demás se conservan en BD.
 * Returns: Account (200) | 400 | 404 | 422 | 500
 */
export async function PATCH(
  req: NextRequest,
  { params }: PARAMS_ACCOUNT_ROUTE
) {
  const { userId } = await params
  return updateNotificationPrefsHandler(req, userId)
}
