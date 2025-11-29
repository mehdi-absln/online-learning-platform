import { config } from 'dotenv'

config() // Load environment variables

export default {
  schema: './server/db/schema.ts',
  out: './server/drizzle/migrations',
  dialect: 'sqlite',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'file:./server/data/db.sqlite',
  },
}