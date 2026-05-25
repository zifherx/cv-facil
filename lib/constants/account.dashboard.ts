import { INotificationItem } from "@/types"

export const NOTIFICATION_ITEMS_CONSTANT: INotificationItem[] = [
  {
    key: "messages",
    title: "Mensajes",
    desc: "Recibir notificaciones por correo cuando alguien te envíe un mensaje.",
  },
  {
    key: "jobAlerts",
    title: "Alertas de trabajo",
    desc: "Recibir notificaciones por correo cuando encontremos un trabajo que pueda interesarte.",
  },
  {
    key: "newsletter",
    title: "Boletín informativo",
    desc: "Recibe nuestro boletín informativo semanal en tu correo.",
  },
  {
    key: "offersAndRecommendations",
    title: "Ofertas y recomendaciones",
    desc: "Recibir correos con ofertas y recomendaciones de cvfácil.",
  },
]
