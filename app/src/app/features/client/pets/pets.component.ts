import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonContent, IonIcon, IonModal, ViewWillEnter } from '@ionic/angular';
import { ApiService, apiError } from '../../../core/services/api';
import { Pet } from '../../../core/models/pet.model';
import { ClientHeaderComponent } from '../../../shared/components/client-header/client-header.component';
import { PetCardComponent } from '../../../shared/components/pet-card/pet-card.component';
import { PetFormComponent } from '../pet-form/pet-form.component';

@Component({
  selector: 'app-pets',
  imports: [IonContent, IonIcon, IonModal, ClientHeaderComponent, PetCardComponent, PetFormComponent],
  templateUrl: './pets.component.html',
  styleUrls: ['./pets.component.scss'],
})
export class PetsComponent implements ViewWillEnter {
  private api = inject(ApiService);
  private alerts = inject(AlertController);
  private router = inject(Router);

  loading = signal(true);
  error = signal('');
  message = signal('');
  pets = signal<Pet[]>([]);
  formOpen = signal(false);

  ionViewWillEnter() {
    this.load();
  }

  async load() {
    this.error.set('');
    try {
      this.pets.set(await this.api.pets());
    } catch (e) {
      this.error.set(apiError(e, 'Não foi possível carregar seus pets.'));
    } finally {
      this.loading.set(false);
    }
  }

  onSaved(pet: Pet) {
    this.formOpen.set(false);
    this.pets.update((list) => [...list, pet].sort((a, b) => a.name.localeCompare(b.name)));
    this.message.set(`${pet.name} foi cadastrado.`);
  }

  book(pet: Pet) {
    this.router.navigate(['/client/booking'], { queryParams: { pet: pet.id } });
  }

  async remove(pet: Pet) {
    const alert = await this.alerts.create({
      header: `Remover ${pet.name}?`,
      message: 'Os dados deste pet serão apagados.',
      buttons: [
        { text: 'Manter', role: 'cancel' },
        { text: 'Remover pet', role: 'destructive' },
      ],
    });
    await alert.present();
    const { role } = await alert.onDidDismiss();
    if (role !== 'destructive') return;

    this.error.set('');
    try {
      await this.api.deletePet(pet.id);
      this.pets.update((list) => list.filter((p) => p.id !== pet.id));
      this.message.set(`${pet.name} foi removido.`);
    } catch (e) {
      this.error.set(apiError(e, 'Não foi possível remover o pet.'));
    }
  }
}
