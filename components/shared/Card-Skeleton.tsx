import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

type CARD_SKELETON_PROPS = {
  hasButton?: boolean
}

export function CardSkeleton({ hasButton = true }: CARD_SKELETON_PROPS) {
  return (
    <Card className="border-border/60">
      <CardHeader className="pb-4">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-3 w-64" />
      </CardHeader>
      <CardContent>
        {hasButton ? (
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-56" />
            <Skeleton className="h-8 w-40" />
          </div>
        ) : (
          // Skeleton de notificaciones — 4 filas con switch
          <div className="space-y-0">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <div className="flex items-start justify-between gap-4 py-4">
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-72" />
                  </div>
                  <Skeleton className="h-6 w-11 shrink-0 rounded-full" />
                </div>
                {i < 3 && <Separator />}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
