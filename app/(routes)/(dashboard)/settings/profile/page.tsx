import type { Metadata } from "next"
import { ProfileView } from "./components/Profile-View"

export const metadata: Metadata = {
  title: "Mi perfil — cvfácil",
}

export default function ProfilePage() {
  return <ProfileView />
}
