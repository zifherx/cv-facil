"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSession, useSignOut } from "@/hooks/auth/use-auth"
import { ChevronRight, LogOut } from "lucide-react"

export function UserFooter() {
  const { data: sessionData } = useSession()
  const { mutate: signOut, isPending } = useSignOut()

  const user = (
    sessionData as {
      user?: { name?: string; email?: string; image?: string }
    } | null
  )?.user
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus:outline-none">
          <Avatar className="h-7 w-7">
            <AvatarImage
              src={user?.image ?? undefined}
              alt={user?.name ?? "Usuario"}
            />
            <AvatarFallback className="bg-[#FAECE7] text-xs font-medium text-[#993C1D]">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm leading-none font-medium">
              {user?.name ?? "Usuario"}
            </p>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {user?.email ?? ""}
            </p>
          </div>
          <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side="top"
        align="start"
        className="w-56"
        sideOffset={8}
      >
        <DropdownMenuItem
          onClick={() => signOut()}
          disabled={isPending}
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          {isPending ? "Cerrando sesión..." : "Cerrar sesión"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
