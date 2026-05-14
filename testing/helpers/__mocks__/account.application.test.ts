import {
  ChangeAccountEmailUseCase,
  CreateAccountUseCase,
  GetAccountUseCase,
  UpdateNotificationPrefsUseCase,
} from "@/modules/account/application"
import {
  AccountAlreadyExistsError,
  AccountEmailAlreadyInUseError,
  AccountNotFoundError,
} from "@/modules/account/domain"
import {
  buildAccount,
  makeAccountRepoMock,
  MOCK_USER_ID,
} from "@/testing/helpers/mock-factories"
import { beforeEach, describe, expect, it } from "vitest"

// ─── CreateAccountUseCase ────────────────────────────────────────────────────

describe("CreateAccountUseCase", () => {
  let repo: ReturnType<typeof makeAccountRepoMock>
  let useCase: CreateAccountUseCase

  beforeEach(() => {
    repo = makeAccountRepoMock()
    useCase = new CreateAccountUseCase(repo)
  })

  it("crea la cuenta cuando el usuario no tiene una", async () => {
    repo.findByUserId.mockResolvedValue(null)
    const expected = buildAccount()
    repo.create.mockResolvedValue(expected)

    const result = await useCase.execute({
      userId: MOCK_USER_ID,
      email: "frojasq@ziphonex.com",
    })

    expect(repo.create).toHaveBeenCalledOnce()
    expect(result.email).toBe("frojasq@ziphonex.com")
  })

  it("activa messages:true por defecto en notificationPreferences", async () => {
    repo.findByUserId.mockResolvedValue(null)
    repo.create.mockResolvedValue(buildAccount())

    const result = await useCase.execute({
      userId: MOCK_USER_ID,
      email: "frojasq@ziphonex.com",
    })

    expect(result.notificationPreferences.messages).toBe(true)
    expect(result.notificationPreferences.jobAlerts).toBe(false)
  })

  it("lanza AccountAlreadyExistsError si ya existe una cuenta", async () => {
    repo.findByUserId.mockResolvedValue(buildAccount())

    await expect(
      useCase.execute({ userId: MOCK_USER_ID, email: "frojasq@ziphonex.com" })
    ).rejects.toThrow(AccountAlreadyExistsError)

    expect(repo.create).not.toHaveBeenCalled()
  })
})

// ─── GetAccountUseCase ───────────────────────────────────────────────────────

describe("GetAccountUseCase", () => {
  let repo: ReturnType<typeof makeAccountRepoMock>
  let useCase: GetAccountUseCase

  beforeEach(() => {
    repo = makeAccountRepoMock()
    useCase = new GetAccountUseCase(repo)
  })

  it("devuelve la cuenta cuando existe", async () => {
    const account = buildAccount()
    repo.findByUserId.mockResolvedValue(account)

    const result = await useCase.execute(MOCK_USER_ID)
    expect(result).toEqual(account)
  })

  it("lanza AccountNotFoundError cuando no existe", async () => {
    repo.findByUserId.mockResolvedValue(null)

    await expect(useCase.execute(MOCK_USER_ID)).rejects.toThrow(
      AccountNotFoundError
    )
  })
})

// ─── ChangeAccountEmailUseCase ───────────────────────────────────────────────

describe("ChangeAccountEmailUseCase", () => {
  let repo: ReturnType<typeof makeAccountRepoMock>
  let useCase: ChangeAccountEmailUseCase

  beforeEach(() => {
    repo = makeAccountRepoMock()
    useCase = new ChangeAccountEmailUseCase(repo)
  })

  it("actualiza el email cuando es diferente al actual", async () => {
    const account = buildAccount({ email: "viejo@ziphonex.com" })
    const updated = buildAccount({ email: "nuevo@ziphonex.com" })
    repo.findByUserId.mockResolvedValue(account)
    repo.updateEmail.mockResolvedValue(updated)

    const result = await useCase.execute(MOCK_USER_ID, {
      newEmail: "nuevo@ziphonex.com",
    })

    expect(repo.updateEmail).toHaveBeenCalledWith(MOCK_USER_ID, {
      newEmail: "nuevo@ziphonex.com",
    })
    expect(result.email).toBe("nuevo@ziphonex.com")
  })

  it("normaliza el email a minúsculas antes de comparar", async () => {
    // El email actual ya está en minúsculas — enviar en mayúsculas debe detectar duplicado
    const account = buildAccount({ email: "frojasq@ziphonex.com" })
    repo.findByUserId.mockResolvedValue(account)

    await expect(
      useCase.execute(MOCK_USER_ID, { newEmail: "FROJASQ@ZIPHONEX.COM" })
    ).rejects.toThrow(AccountEmailAlreadyInUseError)
  })

  it("lanza AccountEmailAlreadyInUseError si el nuevo email es igual al actual", async () => {
    const account = buildAccount({ email: "frojasq@ziphonex.com" })
    repo.findByUserId.mockResolvedValue(account)

    await expect(
      useCase.execute(MOCK_USER_ID, { newEmail: "frojasq@ziphonex.com" })
    ).rejects.toThrow(AccountEmailAlreadyInUseError)

    expect(repo.updateEmail).not.toHaveBeenCalled()
  })

  it("lanza AccountNotFoundError si la cuenta no existe", async () => {
    repo.findByUserId.mockResolvedValue(null)

    await expect(
      useCase.execute(MOCK_USER_ID, { newEmail: "nuevo@ziphonex.com" })
    ).rejects.toThrow(AccountNotFoundError)
  })
})

// ─── UpdateNotificationPrefsUseCase ─────────────────────────────────────────

describe("UpdateNotificationPrefsUseCase", () => {
  let repo: ReturnType<typeof makeAccountRepoMock>
  let useCase: UpdateNotificationPrefsUseCase

  beforeEach(() => {
    repo = makeAccountRepoMock()
    useCase = new UpdateNotificationPrefsUseCase(repo)
  })

  it("actualiza solo las preferencias enviadas", async () => {
    const account = buildAccount()
    const updated = buildAccount({
      notificationPreferences: {
        messages: true,
        jobAlerts: true, // ← cambió
        newsletter: false,
        offersAndRecommendations: false,
      },
    })
    repo.findByUserId.mockResolvedValue(account)
    repo.updateNotificationPrefs.mockResolvedValue(updated)

    const result = await useCase.execute(MOCK_USER_ID, { jobAlerts: true })

    expect(repo.updateNotificationPrefs).toHaveBeenCalledWith(MOCK_USER_ID, {
      jobAlerts: true,
    })
    expect(result.notificationPreferences.jobAlerts).toBe(true)
    expect(result.notificationPreferences.messages).toBe(true) // no cambió
  })

  it("lanza AccountNotFoundError si la cuenta no existe", async () => {
    repo.findByUserId.mockResolvedValue(null)

    await expect(
      useCase.execute(MOCK_USER_ID, { newsletter: true })
    ).rejects.toThrow(AccountNotFoundError)
  })
})
