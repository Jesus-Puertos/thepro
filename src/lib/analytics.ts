/**
 * Capa de analítica.
 *
 * Deliberadamente sin dependencias ni proveedor: el objetivo es dejar el
 * contrato listo (context.md §17) para conectar GA4, Meta Pixel o lo que se
 * decida, sin tocar los componentes.
 *
 * Todo evento se encola en `window.__apexPrimeEvents`, así que una etiqueta
 * instalada más tarde puede reproducir lo ocurrido antes de su carga.
 *
 * Uso declarativo desde Astro (cero JS por componente):
 *   <a data-track="hero_cta_click">…</a>
 *   <a data-track="payment_click" data-track-payload='{"method":"paypal"}'>…</a>
 *
 * Uso imperativo desde una isla de React:
 *   trackEvent('carousel_interaction', { slide: 'coaching' });
 */

import { initAttribution, type Attribution } from './attribution';

export type AnalyticsEvent =
  | 'hero_cta_click'
  | 'nav_cta_click'
  | 'pricing_cta_click'
  | 'final_cta_click'
  | 'checkout_start'
  | 'payment_click'
  | 'faq_open'
  | 'carousel_interaction'
  | 'testimonial_interaction'
  | 'mobile_menu_open'
  | 'scroll_depth';

export interface AnalyticsPayload {
  readonly [key: string]: string | number | boolean | undefined;
}

interface TrackedEvent {
  readonly event: AnalyticsEvent;
  readonly payload: AnalyticsPayload;
  readonly ts: number;
}

declare global {
  interface Window {
    __apexPrimeEvents?: TrackedEvent[];
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

const KNOWN_EVENTS = new Set<string>([
  'hero_cta_click',
  'nav_cta_click',
  'pricing_cta_click',
  'final_cta_click',
  'checkout_start',
  'payment_click',
  'faq_open',
  'carousel_interaction',
  'testimonial_interaction',
  'mobile_menu_open',
  'scroll_depth',
]);

function isAnalyticsEvent(value: string): value is AnalyticsEvent {
  return KNOWN_EVENTS.has(value);
}

/**
 * Atribución de la sesión. Se resuelve en `initAnalytics()` y se adjunta a cada
 * evento, para poder separar por campaña sin tocar las llamadas existentes.
 */
let attribution: Attribution = {};

/** Eventos que además interesan a Meta como conversión. */
const META_EVENTS: Partial<Record<AnalyticsEvent, string>> = {
  checkout_start: 'InitiateCheckout',
  hero_cta_click: 'Lead',
  pricing_cta_click: 'Lead',
  final_cta_click: 'Lead',
};

/** Registra un evento. Seguro de llamar en SSR: no hace nada sin `window`. */
export function trackEvent(event: AnalyticsEvent, payload: AnalyticsPayload = {}): void {
  if (typeof window === 'undefined') return;

  const enriched: AnalyticsPayload = { ...attribution, ...payload };
  const record: TrackedEvent = { event, payload: enriched, ts: Date.now() };

  const queue = (window.__apexPrimeEvents ??= []);
  queue.push(record);

  window.dataLayer?.push({ event, ...enriched });
  window.gtag?.('event', event, enriched);

  const metaEvent = META_EVENTS[event];
  if (metaEvent) {
    window.fbq?.('track', metaEvent, enriched);
  } else {
    window.fbq?.('trackCustom', event, enriched);
  }

  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.debug('[analytics]', event, enriched);
  }
}

function parsePayload(raw: string | null | undefined): AnalyticsPayload {
  if (!raw) return {};
  try {
    const parsed: unknown = JSON.parse(raw);
    return parsed !== null && typeof parsed === 'object' ? (parsed as AnalyticsPayload) : {};
  } catch {
    return {};
  }
}

/** Escucha delegada para `[data-track]` + profundidad de scroll. */
export function initAnalytics(): void {
  if (typeof window === 'undefined') return;

  // Se resuelve antes que nada: el primer evento ya debe salir atribuido.
  attribution = initAttribution();

  document.addEventListener(
    'click',
    (evt) => {
      const target = evt.target;
      if (!(target instanceof Element)) return;

      const trigger = target.closest<HTMLElement>('[data-track]');
      const name = trigger?.dataset.track;
      if (!name || !isAnalyticsEvent(name)) return;

      trackEvent(name, parsePayload(trigger?.dataset.trackPayload));
    },
    { passive: true },
  );

  // Profundidad de scroll: 25 / 50 / 75 / 100.
  const milestones = [25, 50, 75, 100];
  const reached = new Set<number>();
  let ticking = false;

  const measure = (): void => {
    ticking = false;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollable <= 0) return;

    const percent = Math.round((window.scrollY / scrollable) * 100);
    for (const milestone of milestones) {
      if (percent >= milestone && !reached.has(milestone)) {
        reached.add(milestone);
        trackEvent('scroll_depth', { percent: milestone });
      }
    }
    if (reached.size === milestones.length) {
      window.removeEventListener('scroll', onScroll);
    }
  };

  const onScroll = (): void => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(measure);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
}
