/** Ícone de linha para cada serviço do petshop */
export const serviceIcon = (title: string): string => {
  const t = title.toLowerCase();
  if (t.includes('banho')) return 'water-outline';
  if (t.includes('tosa')) return 'cut-outline';
  if (t.includes('vacina')) return 'bandage-outline';
  if (t.includes('consulta')) return 'medkit-outline';
  return 'paw-outline';
};
