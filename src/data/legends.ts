import type { CarouselSlideContent } from '@/types';

import coachCutout from '@assets/the_pro_sin_fondo.png';
import platformArt from '@assets/plataforma_aprendizaje.png';
import feedbackArt from '@assets/feedback.png';
import communityPhoto from '@assets/equipo_esports.png';

/**
 * Los cuatro pilares de la sección "Qué incluye".
 *
 * `focus` es el `object-position` del recorte. Tres de las cuatro imágenes son
 * 16:9 con el sujeto claramente a la derecha (centroide de luminancia en el
 * 69–70 %), así que centrarlas dejaría fuera justo lo que se quiere enseñar.
 * El recorte del coach empieza arriba para no cortarle la cabeza.
 *
 * IMPORTANTE — propiedad intelectual: las dos piezas de key art son material de
 * Electronic Arts / Respawn. Están documentadas en `THIRD_PARTY_ASSETS.md` y
 * deben licenciarse o sustituirse antes de publicar comercialmente. Cambiarlas
 * es editar el `import` y el `focus` de la diapositiva, nada más.
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
    focus: '48% 0%',
    kind: 'cutout',
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
    image: platformArt,
    imageAlt:
      'Escena de Apex Legends: tres personajes estudian paneles holográficos con información táctica',
    focus: '70% 50%',
    kind: 'scene',
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
    image: feedbackArt,
    imageAlt:
      'Escena de Apex Legends: tres personajes trazan una ruta sobre un mapa táctico iluminado en rojo',
    focus: '69% 50%',
    kind: 'scene',
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
    image: communityPhoto,
    imageAlt: 'Tres jugadores de un equipo de esports con sus mandos, en uniforme',
    focus: '52% 40%',
    kind: 'scene',
  },
];
