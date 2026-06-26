// scripts/check-tables.ts
import { sqlite } from '../server/db'

interface TableRow {
  name: string
}

async function checkTables() {
  sqlite
    .prepare('SELECT name FROM sqlite_master WHERE type=\'table\' ORDER BY name')
    .all() as TableRow[]
}

checkTables()
