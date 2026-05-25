import { Skeleton } from "@/components/ui/skeleton"

export function CVCardSkeleton() {
  return (
    <div className="flex overflow-hidden rounded-xl border border-border/60 bg-card">
      {/* Preview skeleton */}
      <Skeleton className="h-40 w-24 shrink-0 rounded-none rounded-l-xl sm:w-28" />

      {/* Content skeleton */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-40" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-3 w-3 rounded-full" />
          </div>
          <Skeleton className="h-3 w-24" />
        </div>
        <div className="mt-3 flex items-center gap-1.5">
          <Skeleton className="h-7 w-16" />
          <Skeleton className="h-7 w-14" />
        </div>
      </div>
    </div>
  )
}
