const pad = (n: number) => String(n).padStart(2, '0');

/** Data local no formato AAAA-MM-DD */
export const toIsoDate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/** "2026-11-14T09:00:00" -> Date local (sem conversão de fuso) */
export const parseLocal = (s: string) => new Date(s.length === 10 ? `${s}T12:00:00` : s);

const weekday = new Intl.DateTimeFormat('pt-BR', { weekday: 'long' });
const dayMonth = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long' });
const short = new Intl.DateTimeFormat('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' });

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** "Sábado, 14 de novembro" */
export const longDate = (s: string) => cap(`${weekday.format(parseLocal(s))}, ${dayMonth.format(parseLocal(s))}`);

/** "Sáb., 14 de nov." */
export const shortDate = (s: string) => cap(short.format(parseLocal(s)));

/** "09:00" */
export const timeOf = (s: string) => s.slice(11, 16);

/** Hoje / Amanhã / data curta */
export const relativeDay = (s: string) => {
  const today = toIsoDate(new Date());
  const t = new Date();
  t.setDate(t.getDate() + 1);
  const day = s.slice(0, 10);
  if (day === today) return 'Hoje';
  if (day === toIsoDate(t)) return 'Amanhã';
  return shortDate(s);
};

export const money = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

/** Idade a partir da data de nascimento: "3 anos", "8 meses" */
export const ageOf = (birth: string | null) => {
  if (!birth) return '';
  const b = parseLocal(birth);
  const now = new Date();
  let months = (now.getFullYear() - b.getFullYear()) * 12 + now.getMonth() - b.getMonth();
  if (now.getDate() < b.getDate()) months--;
  if (months < 1) return 'Menos de 1 mês';
  if (months < 12) return `${months} ${months === 1 ? 'mês' : 'meses'}`;
  const y = Math.floor(months / 12);
  return `${y} ${y === 1 ? 'ano' : 'anos'}`;
};

/** Primeiro nome para saudação */
export const firstName = (name?: string | null) => (name ?? '').trim().split(/\s+/)[0] ?? '';
