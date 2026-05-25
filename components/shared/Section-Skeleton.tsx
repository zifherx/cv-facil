import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export type SECTION_SKELETON_PROPS = {
  rows: number
}

export function SectionSkeleton({ rows = 2 }: SECTION_SKELETON_PROPS) {
  return (
    <Card className="border border-border/60">
      <CardHeader className="pb-4">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-3 w-64" />
      </CardHeader>
      <CardContent className="space-y-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="space-y-1.5">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
