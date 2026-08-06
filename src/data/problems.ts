import type { ProblemItem } from '@/types';

/** context.md §4 — por qué muchos jugadores no mejoran aunque jueguen horas. */
export const problems: readonly ProblemItem[] = [
  {
    id: 'errors',
    index: '01',
    title: 'Repites errores sin identificarlos',
    description:
      'Mueres de la misma forma partida tras partida, pero nadie te señala qué decisión abrió la pelea.',
  },
  {
    id: 'goal',
    index: '02',
    title: 'Juegas sin un objetivo concreto',
    description:
      'Entras a la cola sin saber qué quieres corregir hoy, así que la sesión no deja aprendizaje.',
  },
  {
    id: 'decisions',
    index: '03',
    title: 'No sabes qué decisión fue la incorrecta',
    description:
      'La pelea se perdió tres rotaciones antes y sigues revisando solo el último tiroteo.',
  },
  {
    id: 'settings',
    index: '04',
    title: 'Cambias configuraciones sin entenderlas',
    description:
      'Copias sensibilidad y ajustes de otro jugador sin saber qué resuelven ni cómo medirlos.',
  },
  {
    id: 'feedback',
    index: '05',
    title: 'No tienes feedback de nadie',
    description:
      'Sin alguien que revise tus partidas, tu criterio se queda exactamente donde está.',
  },
  {
    id: 'team',
    index: '06',
    title: 'No encuentras equipo',
    description:
      'Jugar con randoms cada noche hace imposible construir comunicación y rutinas.',
  },
  {
    id: 'competitive',
    index: '07',
    title: 'No sabes cómo empezar en competitivo',
    description:
      'Quieres dar el paso a scrims y torneos, pero no tienes referencia de por dónde arrancar.',
  },
];
