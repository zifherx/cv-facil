import { SettingsTabs } from "@/components/modules/(Settings)/Settings-Tabs"
import { ReactNode } from "react"

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-6">
      <SettingsTabs />
      {children}
    </div>
  )
}
