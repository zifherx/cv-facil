import { CVMiniPreview } from "@/components/modules/(CV)/CV-Mini-Preview"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatRelative } from "@/lib"
import { CV_CARD_PROPS } from "@/types"
import { Clock, Download, Edit, MoreHorizontal, Trash2 } from "lucide-react"
import Link from "next/link"

export function CVCard({ cv, onDelete }: CV_CARD_PROPS) {
  const color = cv.documentConfig.color
  const templateId = cv.documentConfig.templateId

  return (
    <div className="group relative flex overflow-hidden rounded-xl border border-border/60 bg-card transition-shadow hover:shadow-md hover:shadow-black/5">
      {/* Left - Mini CV preview */}
      <div className="w-24 shrink-0 sm:w-28">
        <CVMiniPreview color={color} />
      </div>

      {/* Right - Info + Actions */}
      <div className="flex min-w-0 flex-1 flex-col justify-between p-4">
        <div className="min-w-0 space-y-1">
          {/* Title */}
          <h3 className="truncate text-sm leading-none font-semibold">
            {cv.title}
          </h3>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className="h-5 px-1.5 text-[10px] capitalize"
            >
              {templateId}
            </Badge>
            <div
              className="h-3 w-3 shrink-0 rounded-full border border-border/60"
              style={{ backgroundColor: color }}
              title={`Color: ${color}`}
            />
          </div>

          {/* Last updated */}
          <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Clock className="h-3 w-3 shrink-0" />
            {formatRelative(cv.updatedAt)}
          </p>
        </div>

        {/* Actions */}
        <div className="mt-3 flex items-center gap-1.5">
          <Button
            asChild
            size="sm"
            variant="outline"
            className="h-7 gap-1.5 px-2.5 text-xs"
          >
            <Link href={`/builder/${cv.id}`}>
              <Edit className="h-3.5 w-3.5" />
              Editar
            </Link>
          </Button>

          <Button
            size="sm"
            variant="ghost"
            disabled
            className="h-7 gap-1.5 px-2.5 text-xs text-muted-foreground"
            title="Próximamente"
          >
            <Download className="h-3.5 w-3.5" />
            PDF
          </Button>

          {/* More options */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="ml-auto h-7 w-7 p-0 opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
                aria-label="Más opciones"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem asChild>
                <Link href={`/builder/${cv.id}`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                <Download className="mr-2 h-4 w-4" />
                Descargar PDF
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-destructive focus:text-destructive"
                onClick={() => onDelete(cv)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
