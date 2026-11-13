import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { db } from '../db';

const router = Router();

const sign = (user: any) =>
  jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '2h' });

const publicUser = (u: any) => ({
  id: u.id, name: u.name, email: u.email, phone: u.phone, role: u.role,
});

// Cadastro de cliente (autocadastro)
router.post('/register', (req, res) => {
  const { name, email, phone, cpf, password } = req.body;
  if (!name || !email || !phone || !password || password.length < 6) {
    return res.status(400).json({ message: 'Dados inválidos (senha com mínimo de 6 caracteres)' });
  }
  const exists = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (exists) return res.status(409).json({ message: 'E-mail já cadastrado' });

  const result = db.prepare(
    'INSERT INTO users (name, email, phone, cpf, password_hash, role) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(name, email, phone, cpf ?? null, bcrypt.hashSync(password, 10), 'CLIENT');

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ token: sign(user), user: publicUser(user) });
});

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
  if (!user || !bcrypt.compareSync(password ?? '', user.password_hash)) {
    return res.status(401).json({ message: 'E-mail ou senha inválidos' });
  }
  res.json({ token: sign(user), user: publicUser(user) });
});

// Esqueci a senha: gera token e "envia" o link
router.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  const user = db.prepare('SELECT id FROM users WHERE email = ?').get(email) as any;

  if (user) {
    const token = crypto.randomBytes(32).toString('hex');
    const hash = crypto.createHash('sha256').update(token).digest('hex');
    const expires = Date.now() + 30 * 60 * 1000; // 30 min

    db.prepare('UPDATE users SET reset_token_hash = ?, reset_expires_at = ? WHERE id = ?')
      .run(hash, expires, user.id);

    // TODO: enviar por e-mail (nodemailer). Por enquanto, aparece no console da API:
    console.log(`[RESET] Link: http://localhost:8100/reset-password?token=${token}`);
  }

  // Resposta igual exista ou não o e-mail (não revela quais e-mails estão cadastrados)
  res.json({ message: 'Se o e-mail existir, enviaremos as instruções.' });
});

// Redefinir senha
router.post('/reset-password', (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword || newPassword.length < 6) {
    return res.status(400).json({ message: 'Dados inválidos' });
  }
  const hash = crypto.createHash('sha256').update(token).digest('hex');
  const user = db.prepare(
    'SELECT id FROM users WHERE reset_token_hash = ? AND reset_expires_at > ?'
  ).get(hash, Date.now()) as any;

  if (!user) return res.status(400).json({ message: 'Token inválido ou expirado' });

  db.prepare(
    'UPDATE users SET password_hash = ?, reset_token_hash = NULL, reset_expires_at = NULL WHERE id = ?'
  ).run(bcrypt.hashSync(newPassword, 10), user.id);

  res.json({ message: 'Senha redefinida com sucesso' });
});

export default router;