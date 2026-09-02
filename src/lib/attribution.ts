/**
 * Atribución de tráfico.
 *
 * El pago ocurre fuera de este sitio, así que si los parámetros de campaña se
 * quedan en la landing no hay forma de saber qué venta vino de Instagram y cuál
 * de Facebook (context.md §17). Este módulo hace tres cosas:
 *
 *  1. Captura los parámetros de campaña de la URL de entrada.
 *  2. Los guarda en `sessionStorage` para que sobrevivan a la navegación
 *     interna y a un scroll largo antes de decidirse.
 *  3. Los pega a los enlaces de checkout (`[data-checkout]`) al cargar y cada
 *     vez que se pulsa uno.
 *
 * Criterio de primer toque: si ya hay atribución guardada no se pisa. La
 * campaña que trajo al usuario es la que merece el crédito, no la última página
 * por la que pasó.
 *
 * ⚠️ La URL de checkout actual es un acortador (`tinyurl.com`). TinyURL suele
 * reenviar la query string al destino, pero no lo garantiza. Para que la
 * atribución sea fiable conviene apuntar `offer.checkoutUrl` a la URL real de
 * la plataforma de pago. Ver PENDIENTES.md.
 */

const STORAGE_KEY = 'apexprime:attribution';

/** Parámetros que se conservan. El resto de la query se ignora. */
const TRACKED_PARAMS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'fbclid',
  'gclid',
  'ttclid',
  'msclkid',
] as const;

export type Attribution = Record<string, string>;

function readStored(): Attribution {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    return parsed !== null && typeof parsed === 'object' ? (parsed as Attribution) : {};
  } catch {
    // Modo privado o almacenamiento bloqueado: se sigue sin persistencia.
    return {};
  }
}

function persist(value: Attribution): void {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    /* Sin almacenamiento la atribución dura lo que dure la página. */
  }
}

/** Host del referente, como origen de reserva cuando no hay UTM. */
function referrerSource(): string | null {
  if (!document.referrer) return null;
  try {
    const host = new URL(document.referrer).hostname.replace(/^www\./, '');
    // Mismo sitio: no es una fuente externa.
    if (host === window.location.hostname.replace(/^www\./, '')) return null;
    return host;
  } catch {
    return null;
  }
}

/**
 * Lee la URL actual y devuelve la atribución vigente, guardándola si es la
 * primera vez que se ve una campaña en esta sesión.
 */
export function captureAttribution(): Attribution {
  if (typeof window === 'undefined') return {};

  const stored = readStored();
  const params = new URLSearchParams(window.location.search);

  const incoming: Attribution = {};
  for (const key of TRACKED_PARAMS) {
    const value = params.get(key);
    if (value) incoming[key] = value.slice(0, 120);
  }

  // Primer toque: una campaña ya guardada no se pisa.
  if (Object.keys(stored).length > 0) {
    return stored;
  }

  if (Object.keys(incoming).length === 0) {
    const referrer = referrerSource();
    if (referrer) {
      incoming.utm_source = referrer;
      incoming.utm_medium = 'referral';
    }
  }

  if (Object.keys(incoming).length > 0) persist(incoming);
  return incoming;
}

/** Añade la atribución a una URL sin pisar los parámetros que ya tenga. */
export function decorateUrl(href: string, attribution: Attribution): string {
  if (Object.keys(attribution).length === 0) return href;

  try {
    const url = new URL(href, window.location.href);
    for (const [key, value] of Object.entries(attribution)) {
      if (!url.searchParams.has(key)) url.searchParams.set(key, value);
    }
    return url.toString();
  } catch {
    return href;
  }
}

/**
 * Pega la atribución a todos los enlaces de checkout.
 *
 * Se ejecuta al cargar y otra vez al pulsar, con captura: así también quedan
 * decorados los enlaces que aparecen después (los de las islas de React, que se
 * hidratan más tarde).
 */
export function initAttribution(): Attribution {
  if (typeof window === 'undefined') return {};

  const attribution = captureAttribution();
  if (Object.keys(attribution).length === 0) return attribution;

  const decorateAll = (): void => {
    for (const link of document.querySelectorAll<HTMLAnchorElement>('a[data-checkout]')) {
      if (link.dataset.checkoutDecorated === 'true') continue;
      link.href = decorateUrl(link.href, attribution);
      link.dataset.checkoutDecorated = 'true';
    }
  };

  decorateAll();

  document.addEventListener(
    'pointerdown',
    (event) => {
      const target = event.target;
      if (target instanceof Element && target.closest('a[data-checkout]')) decorateAll();
    },
    { capture: true, passive: true },
  );

  return attribution;
}
