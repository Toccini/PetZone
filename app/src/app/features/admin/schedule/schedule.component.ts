import { Component, computed, inject, signal } from '@angular/core';
import { IonContent, IonIcon, ViewWillEnter } from '@ionic/angular';
import { ApiService, apiError } from '../../../core/services/api';
import { Appointment, AppointmentStatus, STATUS_LABEL } from '../../../core/models/appointment.model';
import { SPECIES_LABEL } from '../../../core/models/pet.model';
import { longDate, money, parseLocal, timeOf, toIsoDate } from '../../../shared/utils/format';
import { serviceIcon } from '../../../shared/utils/service-icon';

type Filter = 'ALL' | AppointmentStatus;

@Component({
  selector: 'app-schedule',
  imports: [IonContent, IonIcon],
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
})
export class ScheduleComponent implements ViewWillEnter {
  private api = inject(ApiService);

  readonly STATUS_LABEL = STATUS_LABEL;
  readonly SPECIES_LABEL = SPECIES_LABEL;
  readonly statuses = Object.keys(STATUS_LABEL) as AppointmentStatus[];
  readonly timeOf = timeOf;
  readonly money = money;
  readonly serviceIcon = serviceIcon;

  date = signal(toIsoDate(new Date()));
  filter = signal<Filter>('ALL');
  loading = signal(true);
  error = signal('');
  message = signal('');
  items = signal<Appointment[]>([]);
  savingId = signal<number | null>(null);

  isToday = computed(() => this.date() === toIsoDate(new Date()));
  title = computed(() => (this.isToday() ? 'Hoje' : longDate(this.date())));
  subtitle = computed(() => (this.isToday() ? longDate(this.date()) : ''));

  filters = computed(() => {
    const list = this.items();
    const count = (s: Filter) => (s === 'ALL' ? list.length : list.filter((a) => a.status === s).length);
    return (['ALL', ...this.statuses] as Filter[]).map((value) => ({
      value,
      label: value === 'ALL' ? 'Todos' : STATUS_LABEL[value],
      count: count(value),
    }));
  });

  filterLabel = computed(() => this.filters().find((f) => f.value === this.filter())?.label ?? '');

  visible = computed(() =>
    this.filter() === 'ALL' ? this.items() : this.items().filter((a) => a.status === this.filter())
  );

  revenue = computed(() =>
    this.items().filter((a) => a.status !== 'CANCELLED').reduce((sum, a) => sum + Number(a.service.price), 0)
  );

  ionViewWillEnter() {
    this.load();
  }

  async load() {
    this.loading.set(true);
    this.error.set('');
    try {
      this.items.set(await this.api.dayAgenda(this.date()));
    } catch (e) {
      this.error.set(apiError(e, 'Não foi possível carregar a agenda.'));
    } finally {
      this.loading.set(false);
    }
  }

  shiftDay(days: number) {
    const d = parseLocal(this.date());
    d.setDate(d.getDate() + days);
    this.setDate(toIsoDate(d));
  }

  goToday() {
    this.setDate(toIsoDate(new Date()));
  }

  setDate(value: string) {
    if (!value) return;
    this.date.set(value);
    this.filter.set('ALL');
    this.message.set('');
    this.load();
  }

  async changeStatus(a: Appointment, status: AppointmentStatus) {
    if (status === a.status) return;
    this.savingId.set(a.id);
    this.error.set('');
    try {
      await this.api.setStatus(a.id, status);
      this.items.update((list) => list.map((x) => (x.id === a.id ? { ...x, status } : x)));
      this.message.set(`${a.pet.name} às ${timeOf(a.date_time)}: ${STATUS_LABEL[status]}.`);
    } catch (e) {
      this.error.set(apiError(e, 'Não foi possível trocar o status.'));
    } finally {
      this.savingId.set(null);
    }
  }

  phoneHref = (phone: string) => `tel:${phone.replace(/\D/g, '')}`;
}
