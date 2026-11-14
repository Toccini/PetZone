import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { supabase } from '../db';

const router = Router();

const sign = (user: any) =>
  jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '2h' });

const publicUser = (u: any) => ({
  id: u.id, name: u.name, email: u.email, phone: u.phone, role: u.role,
});

const findUserByEmail = async (email: string) => {
  const { data, error } = await supabase.from('users').select('*').eq('email', email).maybeSingle();
  if (error) throw error;
  return data;
};

// Cadastro de cliente (autocadastro)
router.post('/register', async (req, res) => {
  const { name, email, phone, cpf, password } = req.body;
  if (!name || !email || !phone || !password || password.length < 6) {
    return res.status(400).json({ message: 'Dados inválidos (senha com mínimo de 6 caracteres)' });
  }
  if (await findUserByEmail(email)) {
    return res.status(409).json({ message: 'E-mail já cadastrado' });
  }

  const { data: user, error } = await supabase
    .from('users')
    .insert({
      name, email, phone, cpf: cpf ?? null,
      password_hash: bcrypt.hashSync(password, 10),
      role: 'CLIENT',
    })
    .select()
    .single();
  if (error) throw error;

  res.status(201).json({ token: sign(user), user: publicUser(user) });
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = email ? await findUserByEmail(email) : null;
  if (!user || !bcrypt.compareSync(password ?? '', user.password_hash)) {
    return res.status(401).json({ message: 'E-mail ou senha inválidos' });
  }
  res.json({ token: sign(user), user: publicUser(user) });
});

// Esqueci a senha: gera token e "envia" o link
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = email ? await findUserByEmail(email) : null;

  if (user) {
    const token = crypto.randomBytes(32).toString('hex');
    const hash = crypto.createHash('sha256').update(token).digest('hex');
    const expires = Date.now() + 30 * 60 * 1000; // 30 min

    const { error } = await supabase
      .from('users')
      .update({ reset_token_hash: hash, reset_expires_at: expires })
      .eq('id', user.id);
    if (error) throw error;

    // TODO: enviar por e-mail (nodemailer). Por enquanto, aparece no console da API:
    console.log(`[RESET] Link: http://localhost:8100/reset-password?token=${token}`);
  }

  // Resposta igual exista ou não o e-mail (não revela quais e-mails estão cadastrados)
  res.json({ message: 'Se o e-mail existir, enviaremos as instruções.' });
});

// Redefinir senha
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword || newPassword.length < 6) {
    return res.status(400).json({ message: 'Dados inválidos' });
  }
  const hash = crypto.createHash('sha256').update(token).digest('hex');
  const { data: user, error } = await supabase
    .from('users')
    .select('id')
    .eq('reset_token_hash', hash)
    .gt('reset_expires_at', Date.now())
    .maybeSingle();
  if (error) throw error;

  if (!user) return res.status(400).json({ message: 'Token inválido ou expirado' });

  const upd = await supabase
    .from('users')
    .update({
      password_hash: bcrypt.hashSync(newPassword, 10),
      reset_token_hash: null,
      reset_expires_at: null,
    })
    .eq('id', user.id);
  if (upd.error) throw upd.error;

  res.json({ message: 'Senha redefinida com sucesso' });
});

export default router;
