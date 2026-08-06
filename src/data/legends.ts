import type { CarouselSlideContent } from '@/types';

import coachCutout from '@assets/the_pro_sin_fondo.png';
import figurePlatform from '@assets/right-legend.png';
import figureFeedback from '@assets/left_legend.png';
import figureCommunity from '@assets/right_legend.png';

/**
 * Diapositivas del carrusel de pilares (sección "Qué incluye").
 *
 * IMPORTANTE — propiedad intelectual: tres de las cuatro figuras son ilustraciones
 * del universo de Apex Legends incluidas en `assets/`. Están documentadas en
 * `THIRD_PARTY_ASSETS.md` y deben sustituirse o licenciarse antes de publicar
 * comercialmente. Cambiarlas es una edición de una sola línea en este archivo.
 */
export const carouselSlides: readonly CarouselSlideContent[] = [
  {
    id: 'coaching',
    index: '01',
    kicker: 'Pilar 01',
    title: 'Coaching e intensivos',
    description:
      'Sesiones en vivo de lunes a viernes sobre situaciones reales de partida. Si no puedes entrar, la grabación te espera.',
    highlight: 'Lunes a viernes',
    accent: '217 45 39',
    ghost: 'COACH',
    image: coachCutout,
    imageAlt: 'The Pro, coach de The Apex Prime, con los brazos cruzados',
    focusX: 49,
  },
  {
    id: 'platform',
    index: '02',
    kicker: 'Pilar 02',
    title: 'Plataforma de aprendizaje',
    description:
      'Cursos ordenados por tema: configuración, fundamentos, comunicación, decisiones y rutinas de entrenamiento.',
    highlight: 'A tu ritmo',
    accent: '214 166 44',
    ghost: 'CURSOS',
    image: figurePlatform,
    imageAlt: 'Ilustración monocroma de una leyenda de Apex Legends',
    focusX: 49,
  },
  {
    id: 'feedback',
    index: '03',
    kicker: 'Pilar 03',
    title: 'Feedback y acompañamiento',
    description:
      'Análisis de tus errores, resolución de dudas y orientación adaptada a tu nivel, con contacto directo con The Pro.',
    highlight: 'Contacto directo',
    accent: '241 239 232',
    ghost: 'REVIEW',
    image: figureFeedback,
    imageAlt: 'Ilustración monocroma de una leyenda de Apex Legends en movimiento',
    focusX: 15,
  },
  {
    id: 'community',
    index: '04',
    kicker: 'Pilar 04',
    title: 'Discord y comunidad',
    description:
      'Acceso exclusivo al Discord para encontrar equipo, seguir los avisos del programa y entrenar acompañado.',
    highlight: 'Encuentra equipo',
    accent: '217 45 39',
    ghost: 'SQUAD',
    image: figureCommunity,
    imageAlt: 'Ilustración monocroma de una leyenda de Apex Legends con lanzacohetes',
    focusX: 76,
  },
];
