import {
  AdminCannotDemoteSelfError,
  AdminUser,
  AdminUserNotFoundError,
  ChangeRoleDTO,
  IAdminRepository,
} from "@/modules/admin/domain"

export class ChangeUserRoleUseCase {
  constructor(private readonly repo: IAdminRepository) {}

  async execute(
    targetId: string,
    data: ChangeRoleDTO,
    requesterId: string // el admin que hace la petición
  ): Promise<AdminUser> {
    // Un admin no puede cambiar su propio rol (evita quedarse sin acceso)
    if (targetId === requesterId) throw new AdminCannotDemoteSelfError()

    const user = await this.repo.findById(targetId)
    if (!user) throw new AdminUserNotFoundError(targetId)

    return this.repo.changeRole(targetId, data)
  }
}
