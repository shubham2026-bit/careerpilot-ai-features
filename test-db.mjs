import postgres from 'postgres'

const connectionString = 'postgresql://postgres:CareerPilot@0001@db.chogupjjindroxqkdxjg.supabase.co:5432/postgres'

try {
  const sql = postgres(connectionString, {
    connect_timeout: 5,
  })
  
  const result = await sql`SELECT NOW()`
  console.log('[v0] Database connection successful!')
  console.log('[v0] Current time:', result[0])
  
  await sql.end()
} catch (error) {
  console.error('[v0] Database connection failed:', error.message)
  process.exit(1)
}
