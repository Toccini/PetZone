import { Component, inject, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonIcon } from '@ionic/angular';
import { ApiService, apiError } from '../../../core/services/api';
import { Pet, SPECIES_LABEL, Species } from '../../../core/models/pet.model';
import { showInvalid } from '../../../shared/utils/form-errors';
import { toIsoDate } from '../../../shared/utils/format';

/** Formulário de cadastro de pet (usado dentro do modal em folha inferior) */
@Component({
  selector: 'app-pet-form',
  imports: [ReactiveFormsModule, IonIcon],
  templateUrl: './pet-form.component.html',
  styleUrls: ['./pet-form.component.scss'],
})
export class PetFormComponent {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);

  saved = output<Pet>();
  cancelled = output<void>();

  loading = signal(false);
  error = signal('');
  today = toIsoDate(new Date());

  species: { value: Species; label: string }[] = (Object.keys(SPECIES_LABEL) as Species[]).map((value) => ({
    value,
    label: SPECIES_LABEL[value],
  }));

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    species: ['DOG' as Species, Validators.required],
    breed: ['', Validators.required],
    weight: ['', Validators.pattern(/^\d{1,3}([.,]\d{1,2})?$/)],
    birth_date: [''],
    notes: ['', Validators.maxLength(300)],
  });

  show = (name: string) => showInvalid(this.form.get(name));

  /** Chips de espécie com setas do teclado, como um grupo de rádio nativo */
  onSpeciesKey(event: KeyboardEvent, index: number) {
    const keys = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    const step = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : -1;
    const next = (index + step + this.species.length) % this.species.length;
    this.form.controls.species.setValue(this.species[next].value);
    (event.currentTarget as HTMLElement).parentElement
      ?.querySelectorAll<HTMLElement>('[role="radio"]')[next]?.focus();
  }

  async submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.error.set('');
    try {
      const v = this.form.getRawValue();
      const pet = await this.api.createPet({
        name: v.name,
        species: v.species,
        breed: v.breed,
        weight: v.weight ? Number(v.weight.replace(',', '.')) : null,
        birth_date: v.birth_date || null,
        notes: v.notes || null,
      });
      this.form.reset();
      this.saved.emit(pet);
    } catch (e) {
      this.error.set(apiError(e, 'Não foi possível salvar o pet. Tente de novo.'));
    } finally {
      this.loading.set(false);
    }
  }
}
