import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_KEY;
if (!url || !key) {
  throw new Error('SUPABASE_URL e SUPABASE_SERVICE_KEY precisam estar no .env');
}

// Conexão com o Supabase via HTTPS (porta 443, funciona em qualquer rede).
// A chave service_role fica só na API — nunca no app.
export const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// Seed: serviços e um admin inicial (só se estiver vazio)
export async function initDb(): Promise<void> {
  const services = await supabase.from('services').select('id', { count: 'exact' }).limit(1);
  if (services.error) throw services.error;
  if (services.count === 0) {
    const { error } = await supabase.from('services').insert([
      { title: 'Banho', duration_minutes: 60, price: 50 },
      { title: 'Tosa', duration_minutes: 60, price: 70 },
      { title: 'Consulta', duration_minutes: 60, price: 120 },
      { title: 'Vacinação', duration_minutes: 60, price: 90 },
    ]);
    if (error) throw error;
  }

  const admins = await supabase
    .from('users').select('id', { count: 'exact' }).eq('role', 'ADMIN').limit(1);
  if (admins.error) throw admins.error;
  if (admins.count === 0) {
    const { error } = await supabase.from('users').insert({
      name: 'Administrador',
      email: 'admin@petshop.com',
      phone: '00000000000',
      password_hash: bcrypt.hashSync('admin123', 10),
      role: 'ADMIN',
    });
    if (error) throw error;
  }
}
