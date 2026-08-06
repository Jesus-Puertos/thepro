import type { FaqItem } from '@/types';
import { site } from './site';

/**
 * context.md §11.
 *
 * `pending: true` marca preguntas cuya respuesta definitiva depende de un dato
 * que el cliente todavía no ha confirmado (context.md §18). Esas respuestas
 * derivan al contacto directo en lugar de inventar una política, y quedan
 * excluidas del JSON-LD `FAQPage`.
 */
export const faq: readonly FaqItem[] = [
  {
    id: 'tiempo',
    question: '¿Cuánto tiempo tengo que dedicarle?',
    answer:
      'El que puedas. Las sesiones son de lunes a viernes y todas quedan grabadas, así que puedes seguir el programa aunque solo entres algunos días. El plan de trabajo se adapta al tiempo que tengas disponible.',
  },
  {
    id: 'poco-tiempo',
    question: '¿Funciona aunque solo juegue una o dos veces por semana?',
    answer:
      'Sí. Precisamente por eso el programa trabaja sobre decisiones y no sobre horas jugadas: si entrenas con un objetivo concreto, cada partida rinde más. Perit0s17 pasó de Diamante a Master jugando una o dos veces por semana.',
  },
  {
    id: 'nivel',
    question: '¿Puedo entrar aunque todavía tenga un nivel bajo?',
    answer:
      'Sí. El programa está abierto desde jugadores que empiezan hasta jugadores que buscan Master, Predator o dar el paso al competitivo. La orientación se adapta a tu nivel actual.',
  },
  {
    id: 'consola',
    question: '¿Puedo entrar si juego en consola?',
    answer:
      'Sí. El programa funciona en PC, Xbox, PlayStation y Nintendo Switch.',
  },
  {
    id: 'no-asisto',
    question: '¿Qué pasa si no puedo asistir a una sesión?',
    answer:
      'No pierdes el contenido: cada sesión queda grabada y puedes verla después, además de todo el material de la plataforma.',
  },
  {
    id: 'grabadas',
    question: '¿Las sesiones quedan grabadas?',
    answer:
      'Sí, todas las sesiones se graban y quedan disponibles para los miembros del programa.',
    // TODO(pendiente): confirmar durante cuánto tiempo permanecen disponibles.
    pending: true,
  },
  {
    id: 'feedback',
    question: '¿Cómo recibo feedback?',
    answer:
      'A través de las sesiones en vivo, del análisis de errores y de la resolución de dudas en el Discord, con contacto directo con The Pro.',
    // TODO(pendiente): confirmar si el feedback es individual, grupal o mixto y cómo se envían las partidas.
    pending: true,
  },
  {
    id: 'acceso',
    question: '¿Cómo obtengo acceso después del pago?',
    answer:
      'Si pagas directamente desde la plataforma, el acceso es inmediato o más rápido. Si pagas con PayPal o transferencia, envía tu comprobante y el acceso puede tardar hasta 24 horas.',
  },
  {
    id: 'renovacion',
    question: '¿La membresía se renueva automáticamente?',
    answer: `Estamos terminando de definir este punto. Antes de inscribirte escríbenos a ${site.contactEmail} y te confirmamos exactamente cómo funciona la renovación.`,
    // TODO(pendiente): confirmar si la renovación es automática y sustituir esta respuesta.
    pending: true,
  },
  {
    id: 'cancelar',
    question: '¿Puedo cancelar cuando quiera?',
    answer: `La política de cancelación se está formalizando. Escríbenos a ${site.contactEmail} antes de inscribirte y te la confirmamos por escrito.`,
    // TODO(pendiente): confirmar política de cancelación y sustituir esta respuesta.
    pending: true,
  },
  {
    id: 'devolucion',
    question: '¿Existe devolución o garantía?',
    answer: `Todavía no publicamos una política de devolución. Preferimos decírtelo antes de que pagues: si es un punto decisivo para ti, escríbenos a ${site.contactEmail} y lo resolvemos antes de inscribirte.`,
    // TODO(pendiente): confirmar política de devolución y garantía.
    pending: true,
  },
  {
    id: 'equipo',
    question: '¿Me ayudan a encontrar equipo?',
    answer:
      'Sí. Dentro del Discord hay espacio para buscar compañeros y armar equipo con otros miembros del programa.',
  },
];

/** Solo las preguntas con respuesta cerrada entran en datos estructurados. */
export const structuredFaq = faq.filter((item) => !item.pending);
