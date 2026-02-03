import { Pool } from 'pg'

/**
 * PostgreSQL connection pool configuration
 */
export const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL || 'postgres://localhost:5432/biciantro',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

/**
 * Execute a database query
 */
export async function query<T>(text: string, params?: unknown[]): Promise<T[]> {
  const client = await pool.connect()
  try {
    const result = await client.query(text, params)
    return result.rows
  } finally {
    client.release()
  }
}

/**
 * Get a database client from the pool
 */
export async function getClient() {
  return pool.connect()
}

/**
 * Close all database connections
 */
export async function closePool() {
  await pool.end()
}

export default pool
