import { Component, ElementRef, computed, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, IonDatetime, IonFooter, IonIcon, IonModal, ViewWillEnter } from '@ionic/angular';
import { ApiService, apiError } from '../../../core/services/api';
import { Pet, SPECIES_LABEL } from '../../../core/models/pet.model';
import { Appointment, Service, Slot } from '../../../core/models/appointment.model';
import { ClientHeaderComponent } from '../../../shared/components/client-header/client-header.component';
import { PetFormComponent } from '../pet-form/pet-form.component';
import { longDate, money, toIsoDate } from '../../../shared/utils/format';
import { serviceIcon } from '../../../shared/utils/service-icon';

type Step = 1 | 2 | 3 | 4;

const STEP_TITLES: Record<Step, string> = {
  1: 'Para qual pet?',
  2: 'Qual serviço?',
  3: 'Escolha o dia e o horário',
  4: 'Confira e confirme',
};

@Component({
  selector: 'app-booking',
  imports: [FormsModule, IonContent, IonFooter, IonIcon, IonDatetime, IonModal, ClientHeaderComponent, PetFormComponent],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss'],
})
export class BookingComponent implements ViewWillEnter {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private stepHeading = viewChild<ElementRef<HTMLElement>>('stepHeading');
  private content = viewChild(IonContent);

  readonly STEP_TITLES = STEP_TITLES;
  readonly SPECIES_LABEL = SPECIES_LABEL;
  readonly money = money;
  readonly longDate = longDate;
  readonly serviceIcon = serviceIcon;
  readonly steps: Step[] = [1, 2, 3, 4];

  step = signal<Step>(1);
  loading = signal(true);
  error = signal('');
  submitting = signal(false);
  done = signal<Appointment | null>(null);
  petFormOpen = signal(false);

  pets = signal<Pet[]>([]);
  services = signal<Service[]>([]);
  slots = signal<Slot[]>([]);
  slotsLoading = signal(false);

  petId = signal<number | null>(null);
  serviceId = signal<number | null>(null);
  date = signal<string>(this.firstOpenDay());
  time = signal<string | null>(null);
  notes = '';

  minDate = this.firstOpenDay();
  maxDate = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 60);
    return toIsoDate(d);
  })();

  pet = computed(() => this.pets().find((p) => p.id === this.petId()) ?? null);
  service = computed(() => this.services().find((s) => s.id === this.serviceId()) ?? null);
  freeSlots = computed(() => this.slots().filter((s) => s.available).length);

  canContinue = computed(() => {
    switch (this.step()) {
      case 1: return this.petId() !== null;
      case 2: return this.serviceId() !== null;
      case 3: return this.time() !== null;
      default: return true;
    }
  });

  /** Mensagem do rodapé quando o botão Continuar ainda não pode ser usado */
  hint = computed(() => {
    if (this.canContinue()) return '';
    return { 1: 'Escolha um pet para continuar.', 2: 'Escolha um serviço para continuar.', 3: 'Escolha um horário para continuar.', 4: '' }[this.step()];
  });

  async ionViewWillEnter() {
    this.reset();
    this.loading.set(true);
    try {
      const [pets, services] = await Promise.all([this.api.pets(), this.api.services()]);
      this.pets.set(pets);
      this.services.set(services);
      const fromQuery = Number(this.route.snapshot.queryParamMap.get('pet'));
      if (pets.some((p) => p.id === fromQuery)) {
        this.petId.set(fromQuery);
      } else if (pets.length === 1) {
        this.petId.set(pets[0].id);
      }
    } catch (e) {
      this.error.set(apiError(e, 'Não foi possível carregar os dados do agendamento.'));
    } finally {
      this.loading.set(false);
    }
  }

  private reset() {
    this.step.set(1);
    this.done.set(null);
    this.error.set('');
    this.petId.set(null);
    this.serviceId.set(null);
    this.date.set(this.firstOpenDay());
    this.time.set(null);
    this.notes = '';
  }

  /** Domingo fechado */
  isOpenDay = (iso: string) => new Date(`${iso.slice(0, 10)}T12:00:00`).getDay() !== 0;

  /** Primeiro dia com atendimento: depois das 17h já pula para amanhã; domingo é fechado */
  private firstOpenDay() {
    const d = new Date();
    if (d.getHours() >= 17) d.setDate(d.getDate() + 1);
    if (d.getDay() === 0) d.setDate(d.getDate() + 1);
    return toIsoDate(d);
  }

  async onDateChange(value: string | string[] | null | undefined) {
    if (typeof value !== 'string') return;
    this.date.set(value.slice(0, 10));
    this.time.set(null);
    await this.loadSlots();
  }

  async loadSlots() {
    this.slotsLoading.set(true);
    this.error.set('');
    try {
      this.slots.set(await this.api.slots(this.date()));
    } catch (e) {
      this.slots.set([]);
      this.error.set(apiError(e, 'Não foi possível carregar os horários.'));
    } finally {
      this.slotsLoading.set(false);
    }
  }

  async next() {
    if (!this.canContinue()) return;
    if (this.step() === 4) return this.confirm();
    const to = (this.step() + 1) as Step;
    if (to === 3) await this.loadSlots();
    this.goTo(to);
  }

  back() {
    if (this.step() > 1) this.goTo((this.step() - 1) as Step);
  }

  private goTo(step: Step) {
    this.error.set('');
    this.step.set(step);
    this.content()?.scrollToTop(0);
    // Leva o foco ao título do passo: o leitor de tela anuncia onde a pessoa está
    setTimeout(() => this.stepHeading()?.nativeElement.focus(), 0);
  }

  onPetSaved(pet: Pet) {
    this.petFormOpen.set(false);
    this.pets.update((list) => [...list, pet]);
    this.petId.set(pet.id);
  }

  async confirm() {
    this.submitting.set(true);
    this.error.set('');
    try {
      const appt = await this.api.book({
        pet_id: this.petId()!,
        service_id: this.serviceId()!,
        date_time: `${this.date()}T${this.time()}`,
        notes: this.notes.trim() || undefined,
      });
      this.done.set(appt);
      this.content()?.scrollToTop(0);
    } catch (e: any) {
      this.error.set(apiError(e, 'Não foi possível confirmar o agendamento. Tente de novo.'));
      if (e?.status === 409) {
        // Horário ocupado por outra pessoa: volta para a escolha de horário já atualizada
        this.time.set(null);
        await this.loadSlots();
        this.step.set(3);
      }
    } finally {
      this.submitting.set(false);
    }
  }

  goHome() {
    this.router.navigateByUrl('/client/home');
  }
}
