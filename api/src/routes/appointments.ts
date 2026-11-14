import { Router } from 'express';
import { supabase } from '../db';
import { auth, requireRole } from '../middleware/auth';

const router = Router();
router.use(auth);

// Horário de funcionamento: segunda a sábado, das 8h às 17h (último atendimento), de hora em hora
const OPEN_HOURS = [8, 9, 10, 11, 13, 14, 15, 16, 17];
const STATUSES = ['CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

const pad = (n: number) => String(n).padStart(2, '0');
const isDate = (s: unknown): s is string => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s);
const nextDay = (date: string) => {
  const d = new Date(`${date}T12:00:00`);
  d.setDate(d.getDate() + 1);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};
const localNow = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:00`;
};

const WITH_DETAILS =
  'id, date_time, status, notes, pet:pets(id, name, species, breed), service:services(id, title, duration_minutes, price)';

// Serviços oferecidos
router.get('/services', async (_req, res) => {
  const { data, error } = await supabase.from('services').select('*').order('id');
  if (error) throw error;
  res.json(data);
});

// Horários de um dia: [{ time: '08:00', available: true }]
router.get('/slots', async (req, res) => {
  const { date } = req.query;
  if (!isDate(date)) return res.status(400).json({ message: 'Data inválida.' });

  const weekday = new Date(`${date}T12:00:00`).getDay();
  if (weekday === 0) return res.json([]); // domingo fechado

  const { data, error } = await supabase
    .from('appointments').select('date_time')
    .gte('date_time', `${date}T00:00:00`).lt('date_time', `${nextDay(date)}T00:00:00`)
    .neq('status', 'CANCELLED');
  if (error) throw error;

  const taken = new Set(data.map((a) => a.date_time.slice(11, 16)));
  const now = localNow();
  res.json(
    OPEN_HOURS.map((h) => {
      const time = `${pad(h)}:00`;
      return { time, available: !taken.has(time) && `${date}T${time}:00` > now };
    })
  );
});

// Agendamentos do cliente logado
router.get('/mine', async (req, res) => {
  const { id } = (req as any).user;
  const { data, error } = await supabase
    .from('appointments').select(WITH_DETAILS)
    .eq('client_id', id).order('date_time', { ascending: true });
  if (error) throw error;
  res.json(data);
});

// Novo agendamento
router.post('/', async (req, res) => {
  const { id } = (req as any).user;
  const { pet_id, service_id, date_time, notes } = req.body;
  if (!pet_id || !service_id || typeof date_time !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:00(:00)?$/.test(date_time)) {
    return res.status(400).json({ message: 'Escolha pet, serviço, data e horário.' });
  }
  const when = date_time.length === 16 ? `${date_time}:00` : date_time;
  if (when <= localNow()) {
    return res.status(400).json({ message: 'Escolha um horário futuro.' });
  }

  const { data: pet } = await supabase
    .from('pets').select('id').eq('id', pet_id).eq('owner_id', id).maybeSingle();
  if (!pet) return res.status(400).json({ message: 'Pet não encontrado.' });

  const { data, error } = await supabase
    .from('appointments')
    .insert({ client_id: id, pet_id, service_id, date_time: when, notes: notes?.trim() || null })
    .select(WITH_DETAILS)
    .single();
  if (error?.code === '23505') {
    return res.status(409).json({ message: 'Horário acabou de ser ocupado. Escolha outro.' });
  }
  if (error) throw error;
  res.status(201).json(data);
});

// Cliente cancela o próprio agendamento
router.patch('/:apptId/cancel', async (req, res) => {
  const { id } = (req as any).user;
  const { data, error } = await supabase
    .from('appointments').update({ status: 'CANCELLED' })
    .eq('id', req.params.apptId).eq('client_id', id).eq('status', 'CONFIRMED')
    .select('id').maybeSingle();
  if (error) throw error;
  if (!data) return res.status(400).json({ message: 'Só é possível cancelar agendamentos confirmados.' });
  res.json({ message: 'Agendamento cancelado' });
});

/* ---------- Administrador ---------- */

// Agenda do dia
router.get('/admin', requireRole('ADMIN'), async (req, res) => {
  const { date } = req.query;
  if (!isDate(date)) return res.status(400).json({ message: 'Data inválida.' });
  const { data, error } = await supabase
    .from('appointments').select(`${WITH_DETAILS}, client:users(id, name, phone)`)
    .gte('date_time', `${date}T00:00:00`).lt('date_time', `${nextDay(date)}T00:00:00`)
    .order('date_time');
  if (error) throw error;
  res.json(data);
});

// Trocar status
router.patch('/admin/:apptId/status', requireRole('ADMIN'), async (req, res) => {
  const { status } = req.body;
  if (!STATUSES.includes(status)) return res.status(400).json({ message: 'Status inválido.' });
  const { data, error } = await supabase
    .from('appointments').update({ status }).eq('id', req.params.apptId)
    .select('id, status').maybeSingle();
  if (error?.code === '23505') {
    return res.status(409).json({ message: 'Já existe outro agendamento neste horário.' });
  }
  if (error) throw error;
  if (!data) return res.status(404).json({ message: 'Agendamento não encontrado.' });
  res.json(data);
});

export default router;
