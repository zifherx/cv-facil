import { listUsersHandler } from "@/modules/admin/presentation"
import { withRateLimit } from "@/shared/lib"
import { NextRequest } from "next/server"

/** GET /api/admin/users?page=1&limit=20 */
export async function GET(req: NextRequest) {
  return withRateLimit(req, "read", () => listUsersHandler(req))
}
