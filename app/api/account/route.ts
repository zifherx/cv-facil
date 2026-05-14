import { createAccountHandler } from "@/modules/account/presentation"
import { NextRequest } from "next/server"

/**
 * POST /api/account
 * Body: { userId: string, email: string, notificationPreferences?: {...} }
 * Returns: Account (201) | 409 (ya existe) | 422 | 500
 */
export async function POST(req: NextRequest) {
  return createAccountHandler(req)
}
