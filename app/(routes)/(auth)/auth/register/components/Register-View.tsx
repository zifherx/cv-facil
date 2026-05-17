import { PanelDerecho } from "@/components/modules/(register)/Panel-Derecho"
import { PanelIzquierdo } from "@/components/modules/(register)/Panel-Izquierdo"

export function RegisterView() {
  return (
    <div className="flex min-h-screen font-['Inter',sans-serif]">
      {/* Panel Izquierdo */}
      <PanelIzquierdo />
      {/* Panel Derecho */}
      <PanelDerecho />
    </div>
  )
}
