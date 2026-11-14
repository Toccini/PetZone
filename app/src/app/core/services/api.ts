import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { NewPet, Pet } from '../models/pet.model';
import { Appointment, AppointmentStatus, Client, Service, Slot } from '../models/appointment.model';

/** Chamadas da API de pets, serviços, agendamentos e clientes */
@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private api = environment.apiUrl;

  private get<T>(path: string, params?: Record<string, string>) {
    return firstValueFrom(this.http.get<T>(`${this.api}${path}`, { params }));
  }
  private send<T>(method: 'post' | 'patch' | 'delete', path: string, body?: unknown) {
    return firstValueFrom(this.http.request<T>(method, `${this.api}${path}`, { body }));
  }

  // Pets do cliente
  pets = () => this.get<Pet[]>('/pets');
  createPet = (pet: NewPet) => this.send<Pet>('post', '/pets', pet);
  deletePet = (id: number) => this.send<void>('delete', `/pets/${id}`);

  // Agendamento
  services = () => this.get<Service[]>('/appointments/services');
  slots = (date: string) => this.get<Slot[]>('/appointments/slots', { date });
  myAppointments = () => this.get<Appointment[]>('/appointments/mine');
  book = (data: { pet_id: number; service_id: number; date_time: string; notes?: string }) =>
    this.send<Appointment>('post', '/appointments', data);
  cancel = (id: number) => this.send<{ message: string }>('patch', `/appointments/${id}/cancel`);

  // Administrador
  dayAgenda = (date: string) => this.get<Appointment[]>('/appointments/admin', { date });
  setStatus = (id: number, status: AppointmentStatus) =>
    this.send<{ id: number; status: AppointmentStatus }>('patch', `/appointments/admin/${id}/status`, { status });
  clients = (q = '') => this.get<Client[]>('/clients', q ? { q } : undefined);
  createClient = (data: { name: string; email: string; phone: string; cpf?: string; password: string }) =>
    this.send<Client>('post', '/clients', data);
}

/** Mensagem de erro da API ou um texto padrão */
export const apiError = (e: any, fallback: string): string =>
  e?.status === 0 ? 'Sem conexão com o servidor. Verifique sua internet e tente de novo.' : e?.error?.message ?? fallback;
