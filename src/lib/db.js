// lib/db.js
import { Pool } from 'pg';

// Crea una nueva conexión al pool
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  
});

export default pool;
