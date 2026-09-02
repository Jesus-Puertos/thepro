// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * La capa de analítica no tiene proveedor conectado, así que un fallo aquí no
 * rompe nada visible: simplemente se dejarían de medir conversiones sin que
 * nadie se entere. De ahí que convenga tenerla cubierta.
 *
 * Se importa dinámicamente en cada test porque el módulo guarda la atribución
 * en una variable de módulo.
 */

async function loadAnalytics(search = '') {
  vi.resetModules();
  window.sessionStorage.clear();
  window.history.replaceState({}, '', `/${search}`);
  delete window.__apexPrimeEvents;
  window.dataLayer = [];
  window.gtag = vi.fn();
  window.fbq = vi.fn();
  return import('@/lib/analytics');
}

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('trackEvent', () => {
  it('encola el evento para que una etiqueta posterior pueda reproducirlo', async () => {
    const { trackEvent } = await loadAnalytics();

    trackEvent('hero_cta_click');

    expect(window.__apexPrimeEvents).toHaveLength(1);
    expect(window.__apexPrimeEvents?.[0]?.event).toBe('hero_cta_click');
  });

  it('reenvía a dataLayer y a gtag', async () => {
    const { trackEvent } = await loadAnalytics();

    trackEvent('pricing_cta_click', { source: 'precio' });

    expect(window.dataLayer).toContainEqual(
      expect.objectContaining({ event: 'pricing_cta_click', source: 'precio' }),
    );
    expect(window.gtag).toHaveBeenCalledWith(
      'event',
      'pricing_cta_click',
      expect.objectContaining({ source: 'precio' }),
    );
  });

  it('traduce a evento estándar de Meta lo que es una conversión', async () => {
    const { trackEvent, initAnalytics } = await loadAnalytics();
    initAnalytics();

    trackEvent('checkout_start');

    expect(window.fbq).toHaveBeenCalledWith(
      'track',
      'InitiateCheckout',
      expect.anything(),
    );
  });

  it('manda como evento personalizado lo que no es conversión', async () => {
    const { trackEvent } = await loadAnalytics();

    trackEvent('faq_open', { question: 'devolucion' });

    expect(window.fbq).toHaveBeenCalledWith(
      'trackCustom',
      'faq_open',
      expect.objectContaining({ question: 'devolucion' }),
    );
  });
});

describe('atribución en los eventos', () => {
  it('adjunta la campaña a todo evento posterior', async () => {
    const { trackEvent, initAnalytics } = await loadAnalytics(
      '?utm_source=instagram&utm_campaign=apex',
    );
    initAnalytics();

    trackEvent('final_cta_click');

    expect(window.__apexPrimeEvents?.[0]?.payload).toMatchObject({
      utm_source: 'instagram',
      utm_campaign: 'apex',
    });
  });

  it('deja que el payload explícito gane sobre la atribución', async () => {
    const { trackEvent, initAnalytics } = await loadAnalytics('?utm_source=instagram');
    initAnalytics();

    trackEvent('payment_click', { utm_source: 'manual' });

    expect(window.__apexPrimeEvents?.[0]?.payload.utm_source).toBe('manual');
  });
});

describe('escucha delegada de [data-track]', () => {
  it('registra el clic y su payload', async () => {
    const { initAnalytics } = await loadAnalytics();
    document.body.innerHTML =
      '<a id="cta" data-track="payment_click" data-track-payload=\'{"method":"paypal"}\'></a>';

    initAnalytics();
    document.getElementById('cta')?.click();

    expect(window.__apexPrimeEvents?.[0]).toMatchObject({
      event: 'payment_click',
      payload: { method: 'paypal' },
    });
  });

  it('funciona pulsando un hijo del elemento marcado', async () => {
    const { initAnalytics } = await loadAnalytics();
    document.body.innerHTML =
      '<a data-track="hero_cta_click"><span id="hijo">Empezar</span></a>';

    initAnalytics();
    document.getElementById('hijo')?.click();

    expect(window.__apexPrimeEvents?.[0]?.event).toBe('hero_cta_click');
  });

  it('ignora nombres de evento que no están declarados', async () => {
    const { initAnalytics } = await loadAnalytics();
    document.body.innerHTML = '<a id="cta" data-track="evento_inventado"></a>';

    initAnalytics();
    document.getElementById('cta')?.click();

    expect(window.__apexPrimeEvents ?? []).toHaveLength(0);
  });

  it('no revienta con un payload que no es JSON válido', async () => {
    const { initAnalytics } = await loadAnalytics();
    document.body.innerHTML = '<a id="cta" data-track="faq_open" data-track-payload="{roto"></a>';

    initAnalytics();
    expect(() => document.getElementById('cta')?.click()).not.toThrow();
    expect(window.__apexPrimeEvents?.[0]?.event).toBe('faq_open');
  });
});
