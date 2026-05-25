import {
  AdminUser,
  AdminUserStats,
  ChangeRoleDTO,
} from "@/modules/admin/domain"

export interface IAdminRepository {
  findAll(
    page: number,
    limit: number
  ): Promise<{ users: AdminUser[]; total: number }>
  findById(id: string): Promise<AdminUser | null>
  findByEmail(email: string): Promise<AdminUser | null>
  changeRole(id: string, data: ChangeRoleDTO): Promise<AdminUser>
  getStats(): Promise<AdminUserStats>
}
