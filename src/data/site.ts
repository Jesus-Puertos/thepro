import type { PaymentMethod, Platform, SocialLink } from '@/types';

/**
 * Fuente única de verdad para marca, oferta y pagos.
 * Todo dato aquí proviene de `context.md`. No añadir cifras ni logros que no
 * estén confirmados por el cliente: usar `PENDING` más abajo.
 */
export const site = {
  name: 'The Apex Prime',
  shortName: 'Apex Prime',
  tagline: 'Programa de coaching para Apex Legends',
  locale: 'es-MX',
  // TODO(pendiente): dominio definitivo. También en `astro.config.mjs`.
  url: 'https://theapexprime.com',
  seo: {
    title: 'The Apex Prime | Coaching para mejorar en Apex Legends',
    description:
      'Mejora tu nivel en Apex Legends con coaching, sesiones intensivas, cursos, feedback y comunidad. Únete a The Apex Prime por $500 MXN al mes.',
  },
  contactEmail: 'heythepromx@gmail.com',
} as const;

export const offer = {
  price: 500,
  currency: 'MXN',
  priceLabel: '$500 MXN',
  periodLabel: 'POR MES',
  priceInline: '$500 MXN / MES',
  /** Método recomendado: acceso directo o más rápido (context.md §3). */
  checkoutUrl: 'https://tinyurl.com/3abk7fek',
  includes: [
    'Sesiones intensivas de lunes a viernes',
    'Acceso a las grabaciones de cada sesión',
    'Plataforma completa de cursos',
    'Discord exclusivo de la comunidad',
    'Feedback y acompañamiento de The Pro',
    'Compatible con PC, Xbox, PlayStation y Switch',
  ],
} as const;

export const platforms: readonly Platform[] = ['PC', 'Xbox', 'PlayStation', 'Switch'];

/**
 * Métodos alternativos. Se muestran con jerarquía menor y plegados por defecto:
 * context.md §19 pide no publicar datos bancarios en lugares inseguros y §3 pide
 * una única acción principal.
 */
export const alternativePayments: readonly PaymentMethod[] = [
  {
    id: 'paypal',
    label: 'PayPal',
    detail: 'heythepromx@gmail.com',
    hint: 'Envía el comprobante después de pagar.',
  },
  {
    id: 'transfer',
    label: 'Transferencia bancaria · Banorte',
    detail: 'CLABE 072370011368384759 · Earving Ochoa',
    hint: 'Envía el comprobante después de pagar.',
  },
];

export const accessNote =
  'Con el pago directo desde la plataforma el acceso es inmediato o más rápido. Con PayPal o transferencia necesitas enviar tu comprobante y el acceso puede tardar hasta 24 horas.';

export const socials: readonly SocialLink[] = [
  // TODO(pendiente): URLs reales de Instagram y Twitch (context.md §13).
  { label: 'Instagram', href: '#' },
  { label: 'Twitch', href: '#' },
];

/**
 * Las tres páginas existen y recogen lo confirmado, pero siguen en borrador:
 * salen con `noindex`, fuera del sitemap y con un aviso visible. Ver
 * `src/components/layout/LegalPage.astro`.
 */
export const legalLinks: readonly SocialLink[] = [
  { label: 'Términos y condiciones', href: '/terminos' },
  { label: 'Aviso de privacidad', href: '/privacidad' },
  { label: 'Política de pagos y cancelación', href: '/pagos' },
];

export const disclaimer =
  'The Apex Prime es un proyecto independiente de coaching y no está afiliado, patrocinado ni respaldado por Electronic Arts. Apex Legends y Apex Legends Global Series son marcas de Electronic Arts Inc.';

/**
 * Datos que context.md §18 marca como pendientes de confirmar.
 * Se listan aquí para que queden centralizados y auditables; ninguno se publica
 * como afirmación cerrada en la página.
 */
export const PENDING = [
  'Significado exacto de la cifra "221 jugadores".',
  'Rango máximo, equipos, torneos y logros verificables de The Pro.',
  'Número de alumnos que alcanzaron Master o Predator.',
  'Duración y horarios oficiales de los intensivos.',
  'Cómo se envían las partidas para revisión.',
  'Si el feedback es individual, grupal o mixto.',
  'Tiempo que permanecen disponibles las grabaciones.',
  'Si la membresía se renueva automáticamente.',
  'Política de cancelación, devolución y garantía.',
  'Flujo exacto de acceso a Discord tras el pago.',
  'Disponibilidad y precio de referencia fuera de México.',
  'URLs reales de Instagram y Twitch.',
  'Dominio definitivo del sitio.',
] as const;
