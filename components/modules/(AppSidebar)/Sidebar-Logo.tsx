import { useSidebar } from "@/components/ui/sidebar"
import { cn } from "@/lib"
import Link from "next/link"

export function SidebarLogo() {
  const { open } = useSidebar()

  return (
    <Link href="/dashboard" className="flex items-center gap-2 px-0">
      <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-[#D85A30] p-2 sm:rounded-lg">
        <span className="text-xs font-bold text-white">CV</span>
      </div>
      <span
        className={cn(
          open
            ? "text-base font-semibold tracking-tight text-foreground"
            : "hidden"
        )}
      >
        cv<span className="text-[#D85A30]">fácil</span>
      </span>
    </Link>
  )
}
