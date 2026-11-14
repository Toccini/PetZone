import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { supabase } from '../db';
import { auth, requireRole } from '../middleware/auth';

// Gestão de clientes pelo administrador (balcão)
const router = Router();
router.use(auth, requireRole('ADMIN'));

router.get('/', async (req, res) => {
  const q = String(req.query.q ?? '').trim().replace(/[,%()]/g, '');
  let query = supabase
    .from('users').select('id, name, email, phone, cpf, pets(count)')
    .eq('role', 'CLIENT').order('name').limit(100);
  if (q) query = query.or(`name.ilike.%${q}%,email.ilike.%${q}%,phone.ilike.%${q}%`);
  const { data, error } = await query;
  if (error) throw error;
  res.json(
    data.map(({ pets, ...u }: any) => ({ ...u, pet_count: pets?.[0]?.count ?? 0 }))
  );
});

router.post('/', async (req, res) => {
  const { name, email, phone, cpf, password } = req.body;
  if (!name || !email || !phone || !password || password.length < 6) {
    return res.status(400).json({ message: 'Preencha nome, e-mail, telefone e uma senha de 6 caracteres ou mais.' });
  }
  const { data: exists } = await supabase.from('users').select('id').eq('email', email).maybeSingle();
  if (exists) return res.status(409).json({ message: 'E-mail já cadastrado' });

  const { data, error } = await supabase
    .from('users')
    .insert({ name, email, phone, cpf: cpf || null, password_hash: bcrypt.hashSync(password, 10), role: 'CLIENT' })
    .select('id, name, email, phone, cpf')
    .single();
  if (error) throw error;
  res.status(201).json({ ...data, pet_count: 0 });
});

export default router;
