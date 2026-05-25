import { CardSkeleton } from "@/components/shared/Card-Skeleton"

export function AccountSkeleton() {
  return (
    <div className="space-y-">
      <CardSkeleton hasButton />
      <CardSkeleton hasButton />
      <CardSkeleton hasButton={false} />
    </div>
  )
}
