// scripts/check-tables.ts
import { sqlite } from '../server/db'

interface TableRow {
  name: string
}

async function checkTables() {
  const tables = sqlite
    .prepare('SELECT name FROM sqlite_master WHERE type=\'table\' ORDER BY name')
    .all() as TableRow[]

  console.log('📋 Tables in database:')
  tables.forEach(table => console.log(`  - ${table.name}`))
}

checkTables()
