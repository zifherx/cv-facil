import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useDeleteCV } from "@/hooks"
import { CV_DELETE_DIALOG_PROPS } from "@/types"
import { Loader2, Trash2 } from "lucide-react"

export function CVDeleteDialog({ cv, onClose }: CV_DELETE_DIALOG_PROPS) {
  const { mutate: deleteCV, isPending } = useDeleteCV()

  const handleConfirm = () => {
    if (!cv) return
    deleteCV(cv.id, { onSuccess: onClose })
  }

  return (
    <Dialog open={!!cv} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>¿Eliminar este CV?</DialogTitle>
          <DialogDescription>
            Vas a eliminar{" "}
            <strong className="text-foreground">
              &ldquo;{cv?.title}&ldquo;
            </strong>
            . Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            size="sm"
            disabled={isPending}
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            size="sm"
            disabled={isPending}
            onClick={handleConfirm}
            className="gap-1.5"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            {isPending ? "Eliminando..." : "Eliminar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
