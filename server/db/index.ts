import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import * as schema from './schema'

const tursoUrl = process.env.TURSO_DATABASE_URL as string
const tursoAuthToken = process.env.TURSO_AUTH_TOKEN as string

if (!tursoUrl) {
  throw new Error('TURSO_DATABASE_URL is not set in .env')
}

const client = createClient({
  url: tursoUrl,
  authToken: tursoAuthToken,
})

export const db = drizzle(client, { schema })
