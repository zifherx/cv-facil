import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getStrength(password: string): {
  score: number
  label: string
  color: string
} {
  if (!password) return { score: 0, label: "", color: "" }
  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  const map = [
    { score: 1, label: "Muy débil", color: "#E24B4A" },
    { score: 2, label: "Débil", color: "#EF9F27" },
    { score: 3, label: "Buena", color: "#1D9E75" },
    { score: 4, label: "Excelente", color: "#1D9E75" },
  ]
  return map[score - 1] ?? { score: 0, label: "", color: "" }
}

export function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60_000)
  const hours = Math.floor(diff / 3_600_000)
  const days = Math.floor(diff / 86_400_000)

  if (mins < 1) return "Ahora mismo"
  if (mins < 60) return `Hace ${mins} min`
  if (hours < 24) return `Hace ${hours}h`
  if (days < 7) return `Hace ${days} día${days > 1 ? "s" : ""}`

  return new Intl.DateTimeFormat("es", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso))
}
