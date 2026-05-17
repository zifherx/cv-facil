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
