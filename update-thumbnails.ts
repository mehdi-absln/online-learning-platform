import Database from 'better-sqlite3'

const db = new Database('./db.sqlite')

const thumbnails = [
  { id: 1, url: 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=800&h=450&fit=crop' },
  { id: 2, url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop' },
  { id: 3, url: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=450&fit=crop' },
  { id: 4, url: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&h=450&fit=crop' },
  { id: 5, url: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&h=450&fit=crop' },
  { id: 6, url: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=450&fit=crop' },
]

const stmt = db.prepare('UPDATE courses SET thumbnail = ? WHERE id = ?')

for (const t of thumbnails) {
  stmt.run(t.url, t.id)
  console.log('Updated course', t.id)
}

console.log('Done!')
db.close()