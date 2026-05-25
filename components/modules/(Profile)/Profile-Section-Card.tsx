import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ReactNode } from "react"

export type PROFILE_SECTION_CARD = {
  title: string
  description: string
  children: ReactNode
}

export function ProfileSectionCard({
  children,
  description,
  title,
}: PROFILE_SECTION_CARD) {
  return (
    <Card className="border border-border/60">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
