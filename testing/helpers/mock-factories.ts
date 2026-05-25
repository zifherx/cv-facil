import { Account, IAccountRepository } from "@/modules/account/domain"
import { AdminUser, IAdminRepository } from "@/modules/admin/domain"
import { CV, ICVRepository } from "@/modules/cv/domain"
import { IProfileRepository, Profile } from "@/modules/profile/domain"
import { vi, type Mocked } from "vitest"

export const MOCK_USER_ID = "664abc000000000000000001"
export const MOCK_CV_ID = "664abc000000000000000002"
export const MOCK_SECTION_ID = "664abc000000000000000003"

export const buildProfile = (overrides: Partial<Profile> = {}): Profile => ({
  id: "664abc000000000000000001",
  userId: MOCK_USER_ID,
  firstName: "Fernando",
  lastName: "Rojas Quezada",
  email: "frojasq@ziphonex.com",
  phone: "924063422",
  avatarUrl: null,
  address: {
    street: "Teodoro Valcarcel 657",
    city: "Trujillo",
    postalCode: "13007",
    country: "PE",
  },
  createdAt: new Date("2026-01-01T00:00:00Z"),
  updatedAt: new Date("2026-01-01T00:00:00Z"),
  ...overrides,
})

export const buildAccount = (overrides: Partial<Account> = {}): Account => ({
  id: "664def000000000000000002",
  userId: MOCK_USER_ID,
  email: "frojasq@ziphonex.com",
  notificationPreferences: {
    messages: true,
    jobAlerts: false,
    newsletter: false,
    offersAndRecommendations: false,
  },
  createdAt: new Date("2026-01-01T00:00:00Z"),
  updatedAt: new Date("2026-01-01T00:00:00Z"),
  ...overrides,
})

export const buildCV = (overrides: Partial<CV> = {}): CV => ({
  id: MOCK_CV_ID,
  userId: MOCK_USER_ID,
  title: "Mi CV Senior Developer",
  slug: "mi-cv-senior-developer-abc123",
  sections: [],
  documentConfig: {
    templateId: "erasmus",
    color: "#E84C3D",
    fontFamily: "DM Sans",
    fontSize: 0,
    language: "PE",
  },
  createdAt: new Date("2026-01-01T00:00:00Z"),
  updatedAt: new Date("2026-01-01T00:00:00Z"),
  ...overrides,
})

export const buildAdminUser = (
  overrides: Partial<AdminUser> = {}
): AdminUser => ({
  id: MOCK_USER_ID,
  name: "Fernando Rojas Quezada",
  email: "frojasq@ziphonex.com",
  role: "user",
  createdAt: new Date("2026-01-01T00:00:00Z"),
  updatedAt: new Date("2026-01-01T00:00:00Z"),
  ...overrides,
})

export const makeProfileRepoMock = (): Mocked<IProfileRepository> =>
  ({
    findByUserId: vi.fn().mockResolvedValue(null),
    create: vi.fn().mockResolvedValue(buildProfile()),
    update: vi.fn().mockResolvedValue(buildProfile()),
    updateAvatar: vi.fn().mockResolvedValue(buildProfile()),
    delete: vi.fn().mockResolvedValue(undefined),
  }) as unknown as Mocked<IProfileRepository>

export const makeAccountRepoMock = (): Mocked<IAccountRepository> =>
  ({
    findByUserId: vi.fn().mockResolvedValue(null),
    create: vi.fn().mockResolvedValue(buildAccount()),
    updateEmail: vi.fn().mockResolvedValue(buildAccount()),
    updateNotificationPrefs: vi.fn().mockResolvedValue(buildAccount()),
    delete: vi.fn().mockResolvedValue(undefined),
  }) as unknown as Mocked<IAccountRepository>

export const makeCVRepoMock = (): Mocked<ICVRepository> =>
  ({
    findById: vi.fn().mockResolvedValue(null),
    findAllByUserId: vi.fn().mockResolvedValue([]),
    create: vi.fn().mockResolvedValue(buildCV()),
    updateTitle: vi.fn().mockResolvedValue(buildCV()),
    updateConfig: vi.fn().mockResolvedValue(buildCV()),
    delete: vi.fn().mockResolvedValue(undefined),
    upsertSection: vi.fn().mockResolvedValue(buildCV()),
    deleteSection: vi.fn().mockResolvedValue(buildCV()),
    reorderSections: vi.fn().mockResolvedValue(buildCV()),
  }) as unknown as Mocked<ICVRepository>

export const makeAdminRepoMock = (): Mocked<IAdminRepository> =>
  ({
    findAll: vi.fn().mockResolvedValue({ users: [], total: 0 }),
    findById: vi.fn().mockResolvedValue(null),
    findByEmail: vi.fn().mockResolvedValue(null),
    changeRole: vi.fn().mockResolvedValue(buildAdminUser()),
    getStats: vi.fn().mockResolvedValue({ total: 0, admins: 0, lastWeek: 0 }),
  }) as unknown as Mocked<IAdminRepository>
