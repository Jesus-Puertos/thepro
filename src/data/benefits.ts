import type { Benefit } from '@/types';

/** context.md §6 — los cuatro pilares. No repetir este contenido en otra sección. */
export const benefits: readonly Benefit[] = [
  {
    id: 'coaching',
    index: '01',
    kicker: 'Pilar 01',
    title: 'Coaching e intensivos',
    description:
      'Sesiones en vivo de lunes a viernes donde trabajamos situaciones reales de partida con explicaciones prácticas.',
    items: [
      'Sesiones de lunes a viernes',
      'Revisión de situaciones reales',
      'Explicaciones prácticas, no teoría suelta',
      'Grabaciones disponibles si no puedes asistir',
    ],
    icon: 'video',
  },
  {
    id: 'platform',
    index: '02',
    kicker: 'Pilar 02',
    title: 'Plataforma de aprendizaje',
    description:
      'Cursos ordenados por tema para que avances a tu ritmo entre sesión y sesión, desde la configuración hasta contenido avanzado.',
    items: [
      'Configuración y ajustes',
      'Fundamentos y mecánica',
      'Comunicación y roles',
      'Toma de decisiones',
      'Rutinas de entrenamiento',
      'Contenido avanzado',
    ],
    icon: 'graduation-cap',
  },
  {
    id: 'feedback',
    index: '03',
    kicker: 'Pilar 03',
    title: 'Feedback y acompañamiento',
    description:
      'Alguien revisa lo que haces y te dice qué corregir, con orientación adaptada a tu nivel y al tiempo que puedes dedicarle.',
    items: [
      'Análisis de errores',
      'Resolución de dudas sobre Apex Legends',
      'Orientación adaptada a tu nivel',
      'Contacto directo con The Pro',
    ],
    icon: 'crosshair',
  },
  {
    id: 'community',
    index: '04',
    kicker: 'Pilar 04',
    title: 'Discord y comunidad',
    description:
      'Un espacio para encontrar equipo, resolver dudas entre partidas y entrenar acompañado en vez de a solas.',
    items: [
      'Acceso exclusivo al Discord',
      'Apoyo para encontrar equipo',
      'Avisos y recursos del programa',
      'Comunidad de jugadores',
      'Un espacio sano para mejorar',
    ],
    icon: 'users',
  },
];
