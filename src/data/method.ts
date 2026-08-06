import type { MethodStep } from '@/types';

/** context.md §5 — la ruta de progreso de The Apex Prime. */
export const methodSteps: readonly MethodStep[] = [
  {
    index: '01',
    title: 'Analizamos cómo juegas',
    description:
      'Partimos de tus partidas reales y de tu nivel actual, no de una plantilla genérica.',
    icon: 'radar',
  },
  {
    index: '02',
    title: 'Detectamos qué frena tu progreso',
    description:
      'Identificamos los patrones que se repiten: posicionamiento, rotaciones, timing o comunicación.',
    icon: 'crosshair',
  },
  {
    index: '03',
    title: 'Aprendes qué hacer en situaciones reales',
    description:
      'Las sesiones trabajan escenarios concretos de partida, no teoría suelta.',
    icon: 'graduation-cap',
  },
  {
    index: '04',
    title: 'Practicas con objetivos concretos',
    description:
      'Sales de cada sesión con algo específico que corregir en tus siguientes partidas.',
    icon: 'target',
  },
  {
    index: '05',
    title: 'Recibes feedback y acompañamiento',
    description:
      'Revisamos qué cambió, resolvemos dudas y ajustamos el siguiente objetivo.',
    icon: 'message-square',
  },
];
