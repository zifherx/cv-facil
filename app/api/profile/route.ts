import { createProfileHandler } from "@/modules/profile/presentation/ProfileController"
import { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  return createProfileHandler(req)
}
