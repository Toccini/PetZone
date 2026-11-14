import { Component, computed, input } from '@angular/core';
import { Pet, SPECIES_LABEL } from '../../../core/models/pet.model';
import { ageOf } from '../../utils/format';

/** Cartão de pet (design.md, seção 8) */
@Component({
  selector: 'app-pet-card',
  template: `
    <article class="card pet" [attr.aria-label]="pet().name">
      <div class="pet__top">
        <span class="avatar" aria-hidden="true">{{ initial() }}</span>
        <div class="pet__id">
          <h3 class="pet__name">{{ pet().name }}</h3>
          <p class="pet__meta">{{ meta() }}</p>
        </div>
        <ng-content select="[actions]" />
      </div>
      @if (pet().notes) {
        <p class="pet__notes">{{ pet().notes }}</p>
      }
    </article>
  `,
  styles: `
    :host { display: block; }
    .pet { height: 100%; box-sizing: border-box; }
    .pet__top { display: flex; align-items: center; gap: 16px; }
    .pet__id { flex: 1; min-width: 0; }
    .pet__name {
      margin: 0;
      font: 500 24px/28px var(--font-display);
      letter-spacing: -0.01em;
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .pet__meta { margin: 4px 0 0; font: 400 14px/20px var(--font-ui); color: var(--color-slate); }
    .pet__notes {
      margin: 16px 0 0;
      font: 400 14px/22px var(--font-ui);
      color: var(--color-graphite);
      display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
    }
  `,
})
export class PetCardComponent {
  pet = input.required<Pet>();

  initial = computed(() => this.pet().name.trim().charAt(0).toUpperCase());
  meta = computed(() => {
    const p = this.pet();
    return [SPECIES_LABEL[p.species], p.breed, ageOf(p.birth_date), p.weight ? `${String(p.weight).replace('.', ',')} kg` : '']
      .filter(Boolean)
      .join(' · ');
  });
}
