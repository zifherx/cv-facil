import { PanelDerecho } from "@/components/modules/(login)/Panel-Derecho"
import { PanelIzquierdo } from "@/components/modules/(login)/Panel-Izquierdo"

export function LoginView() {
  return (
    <div className="font-['Inter', sans-serif] flex min-h-screen">
      {/* Panel Izquierdo - marca Panel */}
      <PanelIzquierdo />
      {/* Derecho - Formulario */}
      <PanelDerecho />
    </div>
  )
}
