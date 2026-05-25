import {
  AdminUser,
  AdminUserNotFoundError,
  IAdminRepository,
} from "@/modules/admin/domain"

export class GetAdminUserUseCase {
  constructor(private readonly repo: IAdminRepository) {}

  async execute(id: string): Promise<AdminUser> {
    const user = await this.repo.findById(id)
    if (!user) throw new AdminUserNotFoundError(id)
    return user
  }
}
