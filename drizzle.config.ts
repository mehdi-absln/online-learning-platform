import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './server/db/schema.ts',
  out: './server/drizzle/migrations',
  dialect: 'sqlite',
  dbCredentials: {
    url: './server/data/db.sqlite',
  }
})
