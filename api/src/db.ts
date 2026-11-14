import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL não definida no .env');
}

// Conexão com o Postgres do Supabase (as tabelas são criadas pelo SQL Editor do Supabase)
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Seed: serviços e um admin inicial (só se estiver vazio)
export async function initDb(): Promise<void> {
  const { rows: [s] } = await pool.query('SELECT COUNT(*)::int AS c FROM services');
  if (s.c === 0) {
    await pool.query(
      `INSERT INTO services (title, duration_minutes, price) VALUES
        ('Banho', 60, 50), ('Tosa', 60, 70), ('Consulta', 60, 120), ('Vacinação', 60, 90)`
    );
  }

  const { rows: [a] } = await pool.query("SELECT COUNT(*)::int AS c FROM users WHERE role = 'ADMIN'");
  if (a.c === 0) {
    await pool.query(
      'INSERT INTO users (name, email, phone, password_hash, role) VALUES ($1, $2, $3, $4, $5)',
      ['Administrador', 'admin@petshop.com', '00000000000', bcrypt.hashSync('admin123', 10), 'ADMIN']
    );
  }
}
