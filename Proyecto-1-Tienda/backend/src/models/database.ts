import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER || 'user',
  host: process.env.DB_HOST || 'db',
  database: process.env.DB_NAME || 'mercadolibre_db',
  password: process.env.DB_PASSWORD || 'password',
  port: parseInt(process.env.DB_PORT || '5432'),
});

// Verificar conexión
pool.on('connect', () => {
  console.log('Conectado a PostgreSQL');
});

pool.on('error', (err) => {
  console.error('Error de conexión a PostgreSQL:', err);
});

export default pool;