import postgres from 'postgres'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const DATABASE_URL = 'postgresql://postgres:CareerPilot@0001@db.chogupjjindroxqkdxjg.supabase.co:5432/postgres'

async function runMigrations() {
  console.log('[v0] Starting database migrations...')
  
  const sql = postgres(DATABASE_URL, {
    connect_timeout: 10,
  })

  try {
    // Read the migration file
    const migrationPath = path.join(__dirname, '../migrations/001_create_tables.sql')
    const migrationSql = fs.readFileSync(migrationPath, 'utf-8')

    console.log('[v0] Running migration: 001_create_tables.sql')
    
    // Execute the migration
    await sql.unsafe(migrationSql)
    
    console.log('[v0] ✅ Migrations completed successfully!')
    console.log('[v0] All tables created and ready to use')
    
  } catch (error) {
    console.error('[v0] ❌ Migration failed:', error.message)
    console.error('[v0] Details:', error)
    process.exit(1)
  } finally {
    await sql.end()
  }
}

runMigrations()
