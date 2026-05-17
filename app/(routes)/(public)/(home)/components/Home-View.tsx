import { ComoFunciona } from "@/components/modules/(home)/Como-Funciona"
import { CTA } from "@/components/modules/(home)/CTA"
import { Features } from "@/components/modules/(home)/Features"
import { HeroHome } from "@/components/modules/(home)/Hero-Home"

export function HomeView() {
  return (
    <div>
      <HeroHome />
      <Features />
      <ComoFunciona />
      <CTA />
    </div>
  )
}
