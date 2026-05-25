import { createProfileHandler } from "@/modules/profile/presentation"
import { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  return createProfileHandler(req)
}
