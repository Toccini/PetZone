export type Species = 'DOG' | 'CAT' | 'OTHER';

export interface Pet {
  id: number;
  owner_id: number;
  name: string;
  species: Species;
  breed: string;
  weight: number | null;
  birth_date: string | null;
  notes: string | null;
}

export type NewPet = Omit<Pet, 'id' | 'owner_id'>;

export const SPECIES_LABEL: Record<Species, string> = {
  DOG: 'Cachorro',
  CAT: 'Gato',
  OTHER: 'Outro',
};
