import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { initDb } from './db';
import authRoutes from './routes/auth';
import petRoutes from './routes/pets';
import appointmentRoutes from './routes/appointments';
import clientRoutes from './routes/clients';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/auth', authRoutes);
app.use('/pets', petRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/clients', clientRoutes);

// Erro inesperado: registra no console e responde com mensagem amigável
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ message: 'Algo deu errado do nosso lado. Tente de novo em instantes.' });
});

const port = process.env.PORT || 3000;
initDb()
  .then(() => app.listen(port, () => console.log(`API rodando em http://localhost:${port}`)))
  .catch((err) => {
    console.error('Erro ao conectar no Supabase:', err?.message || err?.code || err);
    if (err?.hint) console.error('Dica:', err.hint);
    process.exit(1);
  });
