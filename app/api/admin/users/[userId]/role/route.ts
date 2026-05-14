import { changeRoleHandler } from "@/modules/admin/presentation"
import { withRateLimit } from "@/shared/lib"
import { PARAMS_ADMIN_ROUTE } from "@/shared/types"
import { NextRequest } from "next/server"

/** PATCH /api/admin/users/:userId/role - Body: {role: "user" | "admin" } */
export async function PATCH(req: NextRequest, { params }: PARAMS_ADMIN_ROUTE) {
  const { userId } = await params
  return withRateLimit(req, "mutation", () => changeRoleHandler(req, userId))
}
