import { SectionSkeleton } from "@/components/shared/Section-Skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="space-y-1.5">
        <Skeleton className="h-7 w-28" />
        <Skeleton className="h-4 w-72" />
      </div>

      {/* Avatar Skeleton */}
      <Card className="border border-border/60">
        <CardHeader className="pb-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-56" />
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-5">
            <Skeleton className="h-20 w-20 shrink-0 rounded-full" />
            <div className="space-y-2 pt-1">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3 w-48" />
              <div className="flex gap-2 pt-1">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal info Skeleton */}
      <SectionSkeleton rows={2} />

      {/* Address Skeleton */}
      <SectionSkeleton rows={3} />
    </div>
  )
}
