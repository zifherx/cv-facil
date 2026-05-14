import { NextRequest, NextResponse } from "next/server"

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  const publicPaths = [
    "/",
    "/auth/login",
    "/auth/register",
    "/api/auth",
    "/api/auth/register",
  ]
  const isPublic = publicPaths.some((path) => pathname.startsWith(path))

  if (isPublic) return NextResponse.next()

  const sessionCookie =
    req.cookies.get("better-auth.session_token") ??
    req.cookies.get("__Secure-better-auth.session_token")

  if (!sessionCookie && pathname.startsWith("/builder")) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Excluir archivos estáticos y rutas internas de Next.js
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
