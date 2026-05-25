import type { Metadata } from "next"
import { AccountView } from "./components/Account-View"

export const metadata: Metadata = {
  title: "Configuración de cuenta — cvfácil",
}

export default function AccountPage() {
  return <AccountView />
}
