import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { initDb } from './db';
import authRoutes from './routes/auth';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/auth', authRoutes);

const port = process.env.PORT || 3000;
initDb()
  .then(() => app.listen(port, () => console.log(`API rodando em http://localhost:${port}`)))
  .catch((err) => {
    console.error('Erro ao conectar no Supabase:', err.message);
    process.exit(1);
  });