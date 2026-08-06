import type { Stat } from '@/types';

/**
 * Barra de estadísticas (context.md §3 del brief / §18 pendientes).
 * `verified: false` = cifra proporcionada por el cliente pero cuyo significado
 * exacto todavía debe confirmarse. Estas cifras NO se emiten en JSON-LD.
 */
export const stats: readonly Stat[] = [
  {
    id: 'players',
    value: '221+',
    label: 'Jugadores',
    // TODO(pendiente): confirmar si son inscritos activos, históricos o miembros de Discord.
    note: 'Jugadores que forman o han formado parte del programa.',
    verified: false,
  },
  {
    id: 'days',
    value: '5 días',
    label: 'De intensivos',
    note: 'Sesiones de lunes a viernes.',
    verified: true,
  },
  {
    id: 'platforms',
    value: '4',
    label: 'Plataformas',
    note: 'PC, Xbox, PlayStation y Switch.',
    verified: true,
  },
  {
    id: 'price',
    value: '$500 MXN',
    label: 'Por mes',
    note: 'Membresía mensual completa.',
    verified: true,
  },
];

/**
 * Microprueba del hero. Las plataformas se muestran aparte con `PlatformStrip`.
 * TODO(pendiente): "221 jugadores" depende de confirmar su significado exacto.
 */
export const heroProofItems: readonly string[] = [
  '221 jugadores',
  'Sesiones grabadas',
  'Sin importar tu rango',
];
