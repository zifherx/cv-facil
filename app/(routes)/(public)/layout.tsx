import { PublicFooter, PublicHeader } from "@/components/layout/(public)"
import { REACT_COMPONENT } from "@/types"

export default function PublicLayout({ children }: REACT_COMPONENT) {
  return (
    <div className="font-['Instrument-Serif', serif] min-h-screen bg-[#FAFAF8] text-[#1C1C1A]">
      <PublicHeader />
      <main>{children}</main>
      <PublicFooter />
    </div>
  )
}
