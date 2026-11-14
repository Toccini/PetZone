import { Router } from 'express';
import { supabase } from '../db';
import { auth } from '../middleware/auth';

const router = Router();
router.use(auth);

const SPECIES = ['DOG', 'CAT', 'OTHER'];

// Pets do cliente logado
router.get('/', async (req, res) => {
  const { id } = (req as any).user;
  const { data, error } = await supabase
    .from('pets').select('*').eq('owner_id', id).order('name');
  if (error) throw error;
  res.json(data);
});

// Cadastrar pet
router.post('/', async (req, res) => {
  const { id } = (req as any).user;
  const { name, species, breed, weight, birth_date, notes } = req.body;
  if (!name?.trim() || !SPECIES.includes(species) || !breed?.trim()) {
    return res.status(400).json({ message: 'Informe nome, espécie e raça do pet.' });
  }
  const { data, error } = await supabase
    .from('pets')
    .insert({
      owner_id: id,
      name: name.trim(),
      species,
      breed: breed.trim(),
      weight: weight === '' || weight == null ? null : Number(weight),
      birth_date: birth_date || null,
      notes: notes?.trim() || null,
    })
    .select()
    .single();
  if (error) throw error;
  res.status(201).json(data);
});

// Remover pet (só se for do cliente e não tiver agendamentos)
router.delete('/:petId', async (req, res) => {
  const { id } = (req as any).user;
  const { count } = await supabase
    .from('appointments').select('id', { count: 'exact' })
    .eq('pet_id', req.params.petId).limit(1);
  if (count) {
    return res.status(409).json({ message: 'Este pet tem agendamentos e não pode ser removido.' });
  }
  const { error } = await supabase
    .from('pets').delete().eq('id', req.params.petId).eq('owner_id', id);
  if (error) throw error;
  res.status(204).end();
});

export default router;
