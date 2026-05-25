import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { NOTIFICATION_ROW_PROPS } from "@/types"

export function NotificationRow({
  checked,
  disabled,
  isLast,
  item,
  onToggle,
}: NOTIFICATION_ROW_PROPS) {
  return (
    <>
      <div className="flex items-start justify-between gap-4 py-4">
        <div className="flex-1 space-y-0.5">
          <p className="text-sm leading-none font-medium">{item.title}</p>
          <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
        </div>
        <Switch
          checked={checked}
          onCheckedChange={(val) => onToggle(item.key, val)}
          disabled={disabled}
          aria-label={item.title}
          className="mt-0.5 shrink-0 data-[state=checked]:bg-[#D85A30]"
        />
      </div>
      {!isLast && <Separator />}
    </>
  )
}
