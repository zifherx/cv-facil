import {
  DashboardOverview,
  OverviewSkeleton,
} from "@/components/modules/(DashboardPage)"
import { Suspense } from "react"

export function DashboardView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Gestiona y descarga tus CVs profesionales.
        </p>
      </div>

      {/* Stats overview */}
      <Suspense fallback={<OverviewSkeleton />}>
        <DashboardOverview />
      </Suspense>

      {/* Recent CVs */}
      {/* <Suspense fallback={<RecentCVSkeleton />}>
        <RecentCVs />
      </Suspense> */}
    </div>
  )
}
