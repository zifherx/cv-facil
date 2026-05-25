"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PASSWORD_INPUT_PROPS } from "@/types"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"

export function PasswordInput({
  id,
  label,
  registration,
  error,
  placeholder,
}: PASSWORD_INPUT_PROPS) {
  const [show, setShow] = useState(false)

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={show ? "text" : "password"}
          placeholder={placeholder ?? "••••••••"}
          autoComplete={
            id === "currentPassword" ? "current-password" : "new-password"
          }
          {...registration}
          className={
            error
              ? "border-destructive pr-10 focus-visible:ring-destructive"
              : "pr-10"
          }
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
          aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
