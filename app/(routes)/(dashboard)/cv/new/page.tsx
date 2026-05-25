import type { Metadata } from "next"
import { NewCVView } from "./components/New-CV-View"

export const metadata: Metadata = {
  title: "Nuevo CV — cvfácil",
}

export default function NewCVPage() {
  return <NewCVView />
}
