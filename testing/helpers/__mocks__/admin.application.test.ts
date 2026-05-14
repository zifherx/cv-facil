import {
  ChangeUserRoleUseCase,
  GetAdminUserUseCase,
  GetUserStatsUseCase,
  ListUsersUseCase,
} from "@/modules/admin/application"
import {
  AdminCannotDemoteSelfError,
  AdminUserNotFoundError,
} from "@/modules/admin/domain"
import {
  buildAdminUser,
  makeAdminRepoMock,
  MOCK_USER_ID,
} from "@/testing/helpers/mock-factories"
import { beforeEach, describe, expect, it } from "vitest"

const ANOTHER_USER_ID = "664abc000000000000000099"

// ─── ListUsersUseCase ────────────────────────────────────────────────────────

describe("ListUsersUseCase", () => {
  let repo: ReturnType<typeof makeAdminRepoMock>
  let useCase: ListUsersUseCase

  beforeEach(() => {
    repo = makeAdminRepoMock()
    useCase = new ListUsersUseCase(repo)
  })

  it("devuelve usuarios paginados con total y pages calculado", async () => {
    const users = [buildAdminUser(), buildAdminUser({ id: ANOTHER_USER_ID })]
    repo.findAll.mockResolvedValue({ users, total: 45 })

    const result = await useCase.execute(1, 20)

    expect(result.users).toHaveLength(2)
    expect(result.total).toBe(45)
    expect(result.pages).toBe(3) // ceil(45/20) = 3
    expect(repo.findAll).toHaveBeenCalledWith(1, 20)
  })

  it("usa page=1 y limit=20 por defecto", async () => {
    repo.findAll.mockResolvedValue({ users: [], total: 0 })

    await useCase.execute()

    expect(repo.findAll).toHaveBeenCalledWith(1, 20)
  })

  it("calcula pages=1 para total menor que limit", async () => {
    repo.findAll.mockResolvedValue({ users: [], total: 5 })

    const result = await useCase.execute(1, 20)
    expect(result.pages).toBe(1)
  })
})

// ─── GetAdminUserUseCase ─────────────────────────────────────────────────────

describe("GetAdminUserUseCase", () => {
  let repo: ReturnType<typeof makeAdminRepoMock>
  let useCase: GetAdminUserUseCase

  beforeEach(() => {
    repo = makeAdminRepoMock()
    useCase = new GetAdminUserUseCase(repo)
  })

  it("devuelve el usuario cuando existe", async () => {
    const user = buildAdminUser()
    repo.findById.mockResolvedValue(user)

    const result = await useCase.execute(MOCK_USER_ID)
    expect(result).toEqual(user)
  })

  it("lanza AdminUserNotFoundError cuando no existe", async () => {
    repo.findById.mockResolvedValue(null)

    await expect(useCase.execute(MOCK_USER_ID)).rejects.toThrow(
      AdminUserNotFoundError
    )
  })

  it("lanza AdminUserNotFoundError con statusCode 404", async () => {
    repo.findById.mockResolvedValue(null)

    await expect(useCase.execute(MOCK_USER_ID)).rejects.toMatchObject({
      statusCode: 404,
      code: "ADMIN_USER_NOT_FOUND",
    })
  })
})

// ─── ChangeUserRoleUseCase ───────────────────────────────────────────────────

describe("ChangeUserRoleUseCase", () => {
  let repo: ReturnType<typeof makeAdminRepoMock>
  let useCase: ChangeUserRoleUseCase

  beforeEach(() => {
    repo = makeAdminRepoMock()
    useCase = new ChangeUserRoleUseCase(repo)
  })

  it("cambia el rol del usuario target", async () => {
    const target = buildAdminUser({ id: ANOTHER_USER_ID, role: "user" })
    const updated = buildAdminUser({ id: ANOTHER_USER_ID, role: "admin" })
    repo.findById.mockResolvedValue(target)
    repo.changeRole.mockResolvedValue(updated)

    const result = await useCase.execute(
      ANOTHER_USER_ID,
      { role: "admin" },
      MOCK_USER_ID // requester es diferente al target
    )

    expect(repo.changeRole).toHaveBeenCalledWith(ANOTHER_USER_ID, {
      role: "admin",
    })
    expect(result.role).toBe("admin")
  })

  it("lanza AdminCannotDemoteSelfError si el admin intenta cambiar su propio rol", async () => {
    await expect(
      // targetId === requesterId → mismo usuario
      useCase.execute(MOCK_USER_ID, { role: "user" }, MOCK_USER_ID)
    ).rejects.toThrow(AdminCannotDemoteSelfError)

    expect(repo.findById).not.toHaveBeenCalled()
    expect(repo.changeRole).not.toHaveBeenCalled()
  })

  it("lanza AdminUserNotFoundError si el target no existe", async () => {
    repo.findById.mockResolvedValue(null)

    await expect(
      useCase.execute(ANOTHER_USER_ID, { role: "admin" }, MOCK_USER_ID)
    ).rejects.toThrow(AdminUserNotFoundError)

    expect(repo.changeRole).not.toHaveBeenCalled()
  })
})

// ─── GetUserStatsUseCase ─────────────────────────────────────────────────────

describe("GetUserStatsUseCase", () => {
  let repo: ReturnType<typeof makeAdminRepoMock>
  let useCase: GetUserStatsUseCase

  beforeEach(() => {
    repo = makeAdminRepoMock()
    useCase = new GetUserStatsUseCase(repo)
  })

  it("devuelve estadísticas del sistema", async () => {
    const stats = { total: 100, admins: 3, lastWeek: 12 }
    repo.getStats.mockResolvedValue(stats)

    const result = await useCase.execute()

    expect(result).toEqual(stats)
    expect(repo.getStats).toHaveBeenCalledOnce()
  })
})
