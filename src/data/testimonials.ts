import type { Testimonial } from '@/types';

/**
 * context.md §8.
 *
 * REGLA: no inventar citas, rangos ni resultados. Solo Perit0s17 tiene un
 * testimonio textual y un resultado confirmados en context.md. El resto de
 * miembros aparecen únicamente en el roster de la comunidad (nombre + plataforma),
 * que sí es información confirmada.
 *
 * Cuando el cliente envíe más citas: añade `quote`, `rankFrom`, `rankTo` y pon
 * `verified: true`. La tarjeta spotlight aparecerá automáticamente en el carrusel.
 */
export const testimonials: readonly Testimonial[] = [
  {
    id: 'peritos17',
    handle: 'Perit0s17',
    platform: 'PC',
    rankFrom: 'Diamante',
    rankTo: 'Master',
    availability: 'Una o dos veces por semana',
    quote:
      'En poco tiempo noté una mejora muy buena, aunque solo podía jugar una o dos veces por semana.',
    verified: true,
  },
  {
    id: 'zener',
    handle: 'zB I ZeNeR I',
    platform: 'Xbox',
    // TODO(pendiente): solicitar cita textual y resultado concreto.
    verified: false,
  },
  {
    id: 'wiljo',
    handle: 'WILJO',
    platform: 'PC',
    // TODO(pendiente): solicitar cita textual y resultado concreto.
    verified: false,
  },
  {
    id: 'kenal',
    handle: 'KENAL_VZ',
    platform: 'PlayStation',
    // TODO(pendiente): solicitar cita textual y resultado concreto.
    verified: false,
  },
  {
    id: 'mattblwolf',
    handle: 'mattblwolf',
    platform: 'PlayStation',
    // TODO(pendiente): solicitar cita textual y resultado concreto.
    verified: false,
  },
  {
    id: 'maiksensei',
    handle: 'MaikSensei',
    platform: 'PlayStation',
    // TODO(pendiente): solicitar cita textual y resultado concreto.
    verified: false,
  },
  {
    id: 'ordama',
    handle: 'ORDAMA',
    platform: 'PC',
    role: 'CEO de Honorbound',
    // TODO(pendiente): solicitar cita textual.
    verified: false,
  },
];

/** Testimonios completos: los únicos que se renderizan como spotlight. */
export const spotlightTestimonials = testimonials.filter(
  (t): t is Testimonial & { quote: string } => Boolean(t.quote),
);

/** Miembros sin cita confirmada: se muestran solo como roster. */
export const rosterMembers = testimonials.filter((t) => !t.quote);
