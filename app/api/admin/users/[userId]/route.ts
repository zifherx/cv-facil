import { getAdminUserHandler } from "@/modules/admin/presentation"
import { withRateLimit } from "@/shared/lib"
import { PARAMS_ADMIN_ROUTE } from "@/shared/types"
import { NextRequest } from "next/server"

/** GET /api/admin/users/:userId */
export async function GET(req: NextRequest, { params }: PARAMS_ADMIN_ROUTE) {
  const { userId } = await params
  return withRateLimit(req, "read", () => getAdminUserHandler(req, userId))
}
