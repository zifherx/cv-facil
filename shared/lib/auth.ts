import { dash } from "@better-auth/infra"
import { betterAuth } from "better-auth"
import { mongodbAdapter } from "better-auth/adapters/mongodb"
import { nextCookies } from "better-auth/next-js"
import { MongoClient } from "mongodb"

const client = new MongoClient(process.env.DATABASE_URL as string)

export const auth = betterAuth({
  database: mongodbAdapter(client.db()),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },

  // socialProviders: {
  // google: {
  //   clientId: process.env.GOOGLE_CLIENT_ID as string,
  //   clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  // },
  // },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 días
    updateAge: 60 * 60 * 24, //Renueva el token si queda menos de 1 día
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache de 5 minutos - reduce llamadas a BBDD
    },
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user",
        input: false,
      },
    },
  },

  plugins: [dash(), nextCookies()],
})

export type Session = typeof auth.$Infer.Session
export type AuthUser = typeof auth.$Infer.Session.user
