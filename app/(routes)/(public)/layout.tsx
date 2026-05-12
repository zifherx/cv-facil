import { REACT_COMPONENT } from "@/types"

export default function PublicLayout({ children }: REACT_COMPONENT) {
  return (
    <div>
      <div>Header</div>
      <main>{children}</main>
      <div>Header</div>
    </div>
  )
}
