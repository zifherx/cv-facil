import { getUserEmailHandler } from "@/modules/user/presentation/UserController"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  return getUserEmailHandler(req)
}
