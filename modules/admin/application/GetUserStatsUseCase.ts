import { AdminUserStats, IAdminRepository } from "@/modules/admin/domain"

export class GetUserStatsUseCase {
  constructor(private readonly repo: IAdminRepository) {}

  async execute(): Promise<AdminUserStats> {
    return this.repo.getStats()
  }
}
