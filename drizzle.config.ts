// drizzle.config.ts
import { config } from 'dotenv'

config()

export default {
  schema: './server/db/schema.ts',
  out: './server/drizzle/migrations',
  dialect: 'sqlite',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'file:./server/data/db.sqlite',
  },
}
