import { Species } from './pet.model';

export type AppointmentStatus = 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface Service {
  id: number;
  title: string;
  duration_minutes: number;
  price: number;
}

export interface Slot {
  time: string;
  available: boolean;
}

export interface Appointment {
  id: number;
  date_time: string;
  status: AppointmentStatus;
  notes: string | null;
  pet: { id: number; name: string; species: Species; breed: string };
  service: Service;
  client?: { id: number; name: string; phone: string };
}

export const STATUS_LABEL: Record<AppointmentStatus, string> = {
  CONFIRMED: 'Confirmado',
  IN_PROGRESS: 'Em andamento',
  COMPLETED: 'Concluído',
  CANCELLED: 'Cancelado',
};

export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  cpf: string | null;
  pet_count: number;
}
