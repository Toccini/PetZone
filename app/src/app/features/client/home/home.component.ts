import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AlertController, IonContent, IonIcon, IonRefresher, IonRefresherContent, ViewWillEnter } from '@ionic/angular';
import { AuthService } from '../../../core/services/auth';
import { ApiService, apiError } from '../../../core/services/api';
import { Pet } from '../../../core/models/pet.model';
import { Appointment, STATUS_LABEL } from '../../../core/models/appointment.model';
import { ClientHeaderComponent } from '../../../shared/components/client-header/client-header.component';
import { PetCardComponent } from '../../../shared/components/pet-card/pet-card.component';
import { firstName, longDate, money, relativeDay, timeOf, toIsoDate } from '../../../shared/utils/format';
import { serviceIcon } from '../../../shared/utils/service-icon';

@Component({
  selector: 'app-home',
  imports: [RouterLink, IonContent, IonIcon, IonRefresher, IonRefresherContent, ClientHeaderComponent, PetCardComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements ViewWillEnter {
  private auth = inject(AuthService);
  private api = inject(ApiService);
  private alerts = inject(AlertController);

  name = computed(() => firstName(this.auth.user()?.name));

  loading = signal(true);
  error = signal('');
  message = signal('');
  pets = signal<Pet[]>([]);
  appointments = signal<Appointment[]>([]);

  /** Próximos: confirmados ou em andamento, a partir de agora */
  upcoming = computed(() => {
    const d = new Date();
    const now = `${toIsoDate(d)}T${String(d.getHours()).padStart(2, '0')}`;
    return this.appointments().filter(
      (a) => (a.status === 'CONFIRMED' || a.status === 'IN_PROGRESS') && a.date_time.slice(0, 13) >= now
    );
  });

  readonly STATUS_LABEL = STATUS_LABEL;
  readonly relativeDay = relativeDay;
  readonly longDate = longDate;
  readonly timeOf = timeOf;
  readonly money = money;
  readonly serviceIcon = serviceIcon;

  // Recarrega sempre que a aba aparece (ex.: voltou do agendamento)
  ionViewWillEnter() {
    this.load();
  }

  async load(event?: CustomEvent) {
    this.error.set('');
    try {
      const [pets, appts] = await Promise.all([this.api.pets(), this.api.myAppointments()]);
      this.pets.set(pets);
      this.appointments.set(appts);
    } catch (e) {
      this.error.set(apiError(e, 'Não foi possível carregar seus dados. Puxe a tela para tentar de novo.'));
    } finally {
      this.loading.set(false);
      (event?.target as HTMLIonRefresherElement | undefined)?.complete();
    }
  }

  async cancel(a: Appointment) {
    const alert = await this.alerts.create({
      header: 'Cancelar agendamento?',
      message: `${a.service.title} de ${a.pet.name}, ${relativeDay(a.date_time).toLowerCase()} às ${timeOf(a.date_time)}.`,
      buttons: [
        { text: 'Manter', role: 'cancel' },
        { text: 'Cancelar agendamento', role: 'destructive' },
      ],
    });
    await alert.present();
    const { role } = await alert.onDidDismiss();
    if (role !== 'destructive') return;

    try {
      await this.api.cancel(a.id);
      this.appointments.update((list) => list.map((x) => (x.id === a.id ? { ...x, status: 'CANCELLED' } : x)));
      this.message.set('Agendamento cancelado.');
    } catch (e) {
      this.error.set(apiError(e, 'Não foi possível cancelar. Tente de novo.'));
    }
  }
}
