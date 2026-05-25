import { AccountSectionCard } from "@/components/modules/(Account)/Account-Section-Card"
import { NotificationRow } from "@/components/shared/Notification-Row"
import { useUpdateNotifications } from "@/hooks"
import { NOTIFICATION_ITEMS_CONSTANT } from "@/lib/constants/account.dashboard"
import { ACCOUNT_NOTIFICACTIONS_PROPS, NotifKey } from "@/types"

export function AccountNotifications({
  account,
  userId,
}: ACCOUNT_NOTIFICACTIONS_PROPS) {
  const { mutate: updateNotifs, isPending } = useUpdateNotifications(userId)

  const handleToggle = (key: NotifKey, value: boolean) => {
    // Optimistic update ya manejado en el hook — la UI responde al instante
    updateNotifs({ [key]: value })
  }

  return (
    <AccountSectionCard
      title="Notificaciones"
      description="Elige qué comunicaciones deseas recibir por correo electrónico."
    >
      <div className="-mt-2">
        {NOTIFICATION_ITEMS_CONSTANT.map((item, i) => (
          <NotificationRow
            key={item.key}
            item={item}
            checked={account.notificationPreferences[item.key]}
            onToggle={handleToggle}
            disabled={isPending}
            isLast={i === NOTIFICATION_ITEMS_CONSTANT.length - 1}
          />
        ))}
      </div>
    </AccountSectionCard>
  )
}
