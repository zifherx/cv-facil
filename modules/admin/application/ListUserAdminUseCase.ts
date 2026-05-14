import { AdminUser, IAdminRepository } from "@/modules/admin/domain"

export class ListUsersUseCase {
  constructor(private readonly repo: IAdminRepository) {}

  async execute(
    page = 1,
    limit = 20
  ): Promise<{ users: AdminUser[]; total: number; pages: number }> {
    const { users, total } = await this.repo.findAll(page, limit)
    return { users, total, pages: Math.ceil(total / limit) }
  }
}
