import Link from "next/link"

export function SidebarLogo() {
  return (
    <Link href="/dashboard" className="flex items-center gap-2 px-2">
      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#D85A30]">
        <span className="text-xs font-bold text-white">CV</span>
      </div>
      <span className="text-base font-semibold tracking-tight text-foreground">
        cv<span className="text-[#D85A30]">fácil</span>
      </span>
    </Link>
  )
}
