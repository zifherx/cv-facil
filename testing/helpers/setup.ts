import { beforeEach, vi } from "vitest"

vi.mock("next/headers", () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
  cookies: vi.fn().mockReturnValue({
    get: vi.fn().mockReturnValue(undefined),
    set: vi.fn(),
    delete: vi.fn(),
    has: vi.fn().mockReturnValue(false),
  }),
}))

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
  notFound: vi.fn(),
  useRouter: vi.fn().mockReturnValue({ push: vi.fn(), replace: vi.fn() }),
  usePathname: vi.fn().mockReturnValue("/"),
  useParams: vi.fn().mockReturnValue({}),
}))

vi.mock("@/shared/lib/db", () => ({
  conectarBD: vi.fn().mockResolvedValue(undefined),
}))

vi.mock("@/shared/lib/auth", () => ({
  auth: {
    api: {
      getSession: vi.fn().mockResolvedValue(null),
      signUpEmail: vi.fn(),
    },
  },
}))

beforeEach(() => {
  vi.clearAllMocks()
})
