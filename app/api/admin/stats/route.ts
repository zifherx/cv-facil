import { getUserStatsHandler } from "@/modules/admin/presentation"
import { withRateLimit } from "@/shared/lib"
import { NextRequest } from "next/server"

/** GET /api/admin/stats */
export async function GET(req: NextRequest) {
  return withRateLimit(req, "read", () => getUserStatsHandler(req))
}
