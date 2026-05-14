import {
  CreateProfileUseCase,
  GetProfileUseCase,
  UpdateAvatarUseCase,
  UpdateProfileUseCase,
} from "@/modules/profile/application"
import {
  ProfileAlreadyExistsError,
  ProfileNotFoundError,
} from "@/modules/profile/domain"
import {
  buildProfile,
  makeProfileRepoMock,
  MOCK_USER_ID,
} from "@/testing/helpers/mock-factories"
import { beforeEach, describe, expect, it } from "vitest"

// ─── CreateProfileUseCase ────────────────────────────────────────────────────

describe("CreateProfileUseCase", () => {
  let repo: ReturnType<typeof makeProfileRepoMock>
  let useCase: CreateProfileUseCase

  beforeEach(() => {
    repo = makeProfileRepoMock()
    useCase = new CreateProfileUseCase(repo)
  })

  it("crea el perfil cuando el usuario no tiene uno", async () => {
    repo.findByUserId.mockResolvedValue(null)
    const expected = buildProfile()
    repo.create.mockResolvedValue(expected)

    const result = await useCase.execute({
      userId: MOCK_USER_ID,
      firstName: "Fernando",
      lastName: "Rojas Quezada",
      email: "frojasq@ziphonex.com",
    })

    expect(repo.findByUserId).toHaveBeenCalledWith(MOCK_USER_ID)
    expect(repo.create).toHaveBeenCalledOnce()
    expect(result.firstName).toBe("Fernando")
  })

  it("lanza ProfileAlreadyExistsError si el usuario ya tiene perfil", async () => {
    repo.findByUserId.mockResolvedValue(buildProfile())

    await expect(
      useCase.execute({
        userId: MOCK_USER_ID,
        firstName: "Fernando",
        lastName: "Rojas",
        email: "frojasq@ziphonex.com",
      })
    ).rejects.toThrow(ProfileAlreadyExistsError)

    expect(repo.create).not.toHaveBeenCalled()
  })

  it("lanza ProfileAlreadyExistsError con el código correcto", async () => {
    repo.findByUserId.mockResolvedValue(buildProfile())

    await expect(
      useCase.execute({
        userId: MOCK_USER_ID,
        firstName: "X",
        lastName: "Y",
        email: "x@y.com",
      })
    ).rejects.toMatchObject({ code: "PROFILE_ALREADY_EXISTS", statusCode: 409 })
  })
})

// ─── GetProfileUseCase ───────────────────────────────────────────────────────

describe("GetProfileUseCase", () => {
  let repo: ReturnType<typeof makeProfileRepoMock>
  let useCase: GetProfileUseCase

  beforeEach(() => {
    repo = makeProfileRepoMock()
    useCase = new GetProfileUseCase(repo)
  })

  it("devuelve el perfil cuando existe", async () => {
    const profile = buildProfile()
    repo.findByUserId.mockResolvedValue(profile)

    const result = await useCase.execute(MOCK_USER_ID)

    expect(result).toEqual(profile)
    expect(repo.findByUserId).toHaveBeenCalledWith(MOCK_USER_ID)
  })

  it("lanza ProfileNotFoundError cuando no existe", async () => {
    repo.findByUserId.mockResolvedValue(null)

    await expect(useCase.execute(MOCK_USER_ID)).rejects.toThrow(
      ProfileNotFoundError
    )
  })

  it("lanza ProfileNotFoundError con statusCode 404", async () => {
    repo.findByUserId.mockResolvedValue(null)

    await expect(useCase.execute(MOCK_USER_ID)).rejects.toMatchObject({
      statusCode: 404,
      code: "PROFILE_NOT_FOUND",
    })
  })
})

// ─── UpdateProfileUseCase ────────────────────────────────────────────────────

describe("UpdateProfileUseCase", () => {
  let repo: ReturnType<typeof makeProfileRepoMock>
  let useCase: UpdateProfileUseCase

  beforeEach(() => {
    repo = makeProfileRepoMock()
    useCase = new UpdateProfileUseCase(repo)
  })

  it("actualiza el perfil cuando existe", async () => {
    const existing = buildProfile()
    const updated = buildProfile({ phone: "999999999" })
    repo.findByUserId.mockResolvedValue(existing)
    repo.update.mockResolvedValue(updated)

    const result = await useCase.execute(MOCK_USER_ID, { phone: "999999999" })

    expect(repo.update).toHaveBeenCalledWith(MOCK_USER_ID, {
      phone: "999999999",
    })
    expect(result.phone).toBe("999999999")
  })

  it("lanza ProfileNotFoundError si el perfil no existe", async () => {
    repo.findByUserId.mockResolvedValue(null)

    await expect(
      useCase.execute(MOCK_USER_ID, { phone: "999999999" })
    ).rejects.toThrow(ProfileNotFoundError)

    expect(repo.update).not.toHaveBeenCalled()
  })

  it("actualiza solo los campos enviados (parcial)", async () => {
    repo.findByUserId.mockResolvedValue(buildProfile())
    repo.update.mockResolvedValue(
      buildProfile({ city: "Lima" } as Partial<typeof buildProfile>)
    )

    await useCase.execute(MOCK_USER_ID, { address: { city: "Lima" } })

    const updateCall = repo.update.mock.calls[0][1]
    expect(updateCall).toEqual({ address: { city: "Lima" } })
    expect(updateCall).not.toHaveProperty("firstName") // no toca campos no enviados
  })
})

// ─── UpdateAvatarUseCase ─────────────────────────────────────────────────────

describe("UpdateAvatarUseCase", () => {
  let repo: ReturnType<typeof makeProfileRepoMock>
  let useCase: UpdateAvatarUseCase

  beforeEach(() => {
    repo = makeProfileRepoMock()
    useCase = new UpdateAvatarUseCase(repo)
  })

  it("actualiza el avatar con una URL válida", async () => {
    const avatarUrl = "https://storage.example.com/avatars/fernando.jpg"
    repo.findByUserId.mockResolvedValue(buildProfile())
    repo.updateAvatar.mockResolvedValue(buildProfile({ avatarUrl }))

    const result = await useCase.execute({ userId: MOCK_USER_ID, avatarUrl })

    expect(repo.updateAvatar).toHaveBeenCalledWith(MOCK_USER_ID, avatarUrl)
    expect(result.avatarUrl).toBe(avatarUrl)
  })

  it("elimina el avatar pasando null", async () => {
    repo.findByUserId.mockResolvedValue(
      buildProfile({ avatarUrl: "https://old.jpg" })
    )
    repo.updateAvatar.mockResolvedValue(buildProfile({ avatarUrl: null }))

    const result = await useCase.execute({
      userId: MOCK_USER_ID,
      avatarUrl: null,
    })

    expect(repo.updateAvatar).toHaveBeenCalledWith(MOCK_USER_ID, null)
    expect(result.avatarUrl).toBeNull()
  })

  it("lanza ProfileNotFoundError si el perfil no existe", async () => {
    repo.findByUserId.mockResolvedValue(null)

    await expect(
      useCase.execute({ userId: MOCK_USER_ID, avatarUrl: null })
    ).rejects.toThrow(ProfileNotFoundError)

    expect(repo.updateAvatar).not.toHaveBeenCalled()
  })
})
