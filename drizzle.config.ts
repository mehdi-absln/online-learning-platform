import { config } from 'dotenv'

config() // Load environment variables

export default {
  schema: './server/db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'file:./data/db.sqlite',
  },
}