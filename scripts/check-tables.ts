// scripts/check-tables.ts
import { db } from '../server/db'
import { sql } from 'drizzle-orm'

async function checkTables() {
  const tables = await db.all(sql`
    SELECT name FROM sqlite_master WHERE type='table' ORDER BY name
  `)
  
  console.log('📋 Tables in database:')
  tables.forEach((t: any) => console.log(`  - ${t.name}`))
}

checkTables()