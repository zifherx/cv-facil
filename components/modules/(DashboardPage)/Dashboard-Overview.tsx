/* eslint-disable react-hooks/purity */
"use client"

import { useCVList, useUserId } from "@/hooks"
import { IStatDashboardPage } from "@/types"
import { Clock, Download, FileText } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { Skeleton } from "../../ui/skeleton"

export function DashboardOverview() {
  const userId = useUserId()
  const { data: cvs, isLoading } = useCVList()

  const totalCVs = cvs?.length ?? 0
  const lastUpdated = cvs?.[0]?.updatedAt
    ? new Intl.RelativeTimeFormat("es", { numeric: "auto" }).format(
        Math.round(
          (new Date(cvs[0].updatedAt).getTime() - Date.now()) /
            (1000 * 60 * 60 * 24)
        ),
        "day"
      )
    : "-"

  const STATS_DASHBOARD_PAGE: IStatDashboardPage[] = [
    {
      title: "Total de CVs",
      value: isLoading ? "-" : totalCVs,
      icon: FileText,
      desc: "CVs creados",
      color: "text-[#D85A30]",
      bg: "bg-[#FAECE7]",
    },
    {
      title: "Descargas",
      value: "-",
      icon: Download,
      desc: "Próximamente",
      color: "text-[#0F6E56]",
      bg: "bg-[#E1F5EE]",
    },
    {
      title: "Última edición",
      value: isLoading ? "-" : lastUpdated,
      icon: Clock,
      desc: cvs?.[0]?.title ?? "Sin CVs aún",
      color: "text-[#185FA5]",
      bg: "bg-[#E6F1FB]",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
      {STATS_DASHBOARD_PAGE.map((stat) => {
        const IconStat = stat.icon

        return (
          <Card key={stat.title} className="border border-gray-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`rounded-lg p-2 ${stat.bg}`}>
                <IconStat className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>

            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <div className="text-3xl font-bold">{stat.value}</div>
              )}
              <p className="mt-1 truncate text-xs text-muted-foreground">
                {stat.desc}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
