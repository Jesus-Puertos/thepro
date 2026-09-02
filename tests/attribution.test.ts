// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';

import { captureAttribution, decorateUrl, initAttribution } from '@/lib/attribution';

/**
 * La atribución es la única forma de saber si una venta vino de Instagram o de
 * Facebook, porque el pago ocurre fuera del sitio. Si esto se rompe, la
 * inversión en campañas deja de ser medible sin que nada falle a la vista.
 */

function visit(search: string, referrer = ''): void {
  window.sessionStorage.clear();
  window.history.replaceState({}, '', `/${search}`);
  Object.defineProperty(document, 'referrer', { value: referrer, configurable: true });
}

beforeEach(() => {
  visit('');
  document.body.innerHTML = '';
});

describe('captura', () => {
  it('recoge los parámetros de campaña de la URL de entrada', () => {
    visit('?utm_source=instagram&utm_medium=social&utm_campaign=apex_prime');

    expect(captureAttribution()).toEqual({
      utm_source: 'instagram',
      utm_medium: 'social',
      utm_campaign: 'apex_prime',
    });
  });

  it('conserva los identificadores de clic de los anuncios', () => {
    visit('?fbclid=ABC123');
    expect(captureAttribution().fbclid).toBe('ABC123');
  });

  it('ignora los parámetros que no son de campaña', () => {
    visit('?utm_source=facebook&ref=algo&debug=1');

    const result = captureAttribution();
    expect(result.utm_source).toBe('facebook');
    expect(result.ref).toBeUndefined();
    expect(result.debug).toBeUndefined();
  });

  it('no devuelve nada cuando no hay campaña ni referente', () => {
    visit('');
    expect(captureAttribution()).toEqual({});
  });
});

describe('primer toque', () => {
  it('no pisa la campaña guardada con una posterior', () => {
    visit('?utm_source=instagram&utm_campaign=lanzamiento');
    expect(captureAttribution().utm_source).toBe('instagram');

    // Misma sesión, otra URL: manda la campaña que trajo al usuario.
    window.history.replaceState({}, '', '/?utm_source=facebook');
    expect(captureAttribution().utm_source).toBe('instagram');
  });
});

describe('referente como origen de reserva', () => {
  it('usa el host del referente cuando no hay UTM', () => {
    visit('', 'https://www.instagram.com/algo');

    expect(captureAttribution()).toEqual({
      utm_source: 'instagram.com',
      utm_medium: 'referral',
    });
  });

  it('no cuenta la navegación interna como fuente externa', () => {
    visit('', `${window.location.origin}/otra`);
    expect(captureAttribution()).toEqual({});
  });

  it('deja que los UTM manden sobre el referente', () => {
    visit('?utm_source=newsletter', 'https://www.instagram.com/algo');
    expect(captureAttribution().utm_source).toBe('newsletter');
  });
});

describe('decoración de URLs', () => {
  it('añade la atribución a la URL de checkout', () => {
    const result = decorateUrl('https://tinyurl.com/abc', { utm_source: 'instagram' });
    expect(result).toContain('utm_source=instagram');
  });

  it('respeta los parámetros que la URL ya traía', () => {
    const result = decorateUrl('https://tinyurl.com/abc?utm_source=directo', {
      utm_source: 'instagram',
    });
    expect(result).toContain('utm_source=directo');
    expect(result).not.toContain('instagram');
  });

  it('devuelve la URL intacta si no hay nada que atribuir', () => {
    expect(decorateUrl('https://tinyurl.com/abc', {})).toBe('https://tinyurl.com/abc');
  });
});

describe('integración con el marcado', () => {
  it('decora los enlaces marcados como checkout y deja el resto en paz', () => {
    visit('?utm_source=instagram&utm_campaign=apex');
    document.body.innerHTML = `
      <a id="cta" href="https://tinyurl.com/abc" data-checkout=""></a>
      <a id="otro" href="https://ejemplo.com/algo"></a>
    `;

    initAttribution();

    const cta = document.getElementById('cta') as HTMLAnchorElement;
    const otro = document.getElementById('otro') as HTMLAnchorElement;

    expect(cta.href).toContain('utm_source=instagram');
    expect(cta.href).toContain('utm_campaign=apex');
    expect(otro.href).not.toContain('utm_source');
  });

  it('no acumula parámetros si se decora dos veces', () => {
    visit('?utm_source=instagram');
    document.body.innerHTML = '<a id="cta" href="https://tinyurl.com/abc" data-checkout=""></a>';

    initAttribution();
    const once = (document.getElementById('cta') as HTMLAnchorElement).href;
    initAttribution();
    const twice = (document.getElementById('cta') as HTMLAnchorElement).href;

    expect(twice).toBe(once);
    expect(twice.match(/utm_source/g)).toHaveLength(1);
  });
});
