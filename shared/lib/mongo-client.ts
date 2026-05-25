import { MongoClient } from "mongodb"

const MONGODB_URI = process.env.DATABASE_URL as string

if (!MONGODB_URI) {
  throw new Error("DATABASE_URL is not defined in environment variables")
}

// Singleton — reutiliza la misma conexión en hot-reloads de Next.js dev
declare global {
  var _mongoNativeClient: MongoClient | undefined
}

let client: MongoClient

if (process.env.NODE_ENV === "development") {
  if (!global._mongoNativeClient) {
    global._mongoNativeClient = new MongoClient(MONGODB_URI)
  }
  client = global._mongoNativeClient
} else {
  client = new MongoClient(MONGODB_URI)
}

/**
 * Devuelve el MongoClient nativo conectado.
 * Úsalo en el módulo admin (que lee la colección "user" de better-auth)
 * y en auth.ts para el mongodbAdapter.
 */
export async function getMongoClient(): Promise<MongoClient> {
  // connect() es idempotente — seguro llamarlo múltiples veces
  await client.connect()
  return client
}

export { client as mongoClient }
