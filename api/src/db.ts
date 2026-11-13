import { DatabaseSync } from 'node:sqlite';
import bcrypt from 'bcryptjs';

export const db = new DatabaseSync('petshop.db');
db.exec('PRAGMA foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    name          TEXT NOT NULL,
    email         TEXT NOT NULL UNIQUE,
    phone         TEXT NOT NULL,
    cpf           TEXT,
    password_hash TEXT NOT NULL,
    role          TEXT NOT NULL CHECK (role IN ('CLIENT','ADMIN')),
    reset_token_hash TEXT,
    reset_expires_at INTEGER
  );

  CREATE TABLE IF NOT EXISTS pets (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    owner_id   INTEGER NOT NULL REFERENCES users(id),
    name       TEXT NOT NULL,
    species    TEXT NOT NULL CHECK (species IN ('DOG','CAT','OTHER')),
    breed      TEXT NOT NULL,
    weight     REAL,
    birth_date TEXT,
    notes      TEXT
  );

  CREATE TABLE IF NOT EXISTS services (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    title            TEXT NOT NULL,
    duration_minutes INTEGER NOT NULL,
    price            REAL NOT NULL
  );

  CREATE TABLE IF NOT EXISTS appointments (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id  INTEGER NOT NULL REFERENCES users(id),
    pet_id     INTEGER NOT NULL REFERENCES pets(id),
    service_id INTEGER NOT NULL REFERENCES services(id),
    date_time  TEXT NOT NULL,
    status     TEXT NOT NULL DEFAULT 'CONFIRMED'
               CHECK (status IN ('CONFIRMED','IN_PROGRESS','COMPLETED','CANCELLED')),
    notes      TEXT
  );

  CREATE UNIQUE INDEX IF NOT EXISTS uniq_slot
    ON appointments(date_time) WHERE status != 'CANCELLED';
`);

// Seed: serviços e um admin inicial (só se estiver vazio)
const servicesCount = (db.prepare('SELECT COUNT(*) c FROM services').get() as any).c;
if (servicesCount === 0) {
  const ins = db.prepare('INSERT INTO services (title, duration_minutes, price) VALUES (?, ?, ?)');
  ins.run('Banho', 60, 50);
  ins.run('Tosa', 60, 70);
  ins.run('Consulta', 60, 120);
  ins.run('Vacinação', 60, 90);
}

const adminCount = (db.prepare("SELECT COUNT(*) c FROM users WHERE role = 'ADMIN'").get() as any).c;
if (adminCount === 0) {
  db.prepare(
    'INSERT INTO users (name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?)'
  ).run('Administrador', 'admin@petshop.com', '00000000000', bcrypt.hashSync('admin123', 10), 'ADMIN');
}