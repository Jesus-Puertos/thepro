import { describe, expect, it } from 'vitest';

import { faq, structuredFaq } from '@/data/faq';
import { stats, heroProofItems } from '@/data/stats';
import { testimonials, spotlightTestimonials, rosterMembers } from '@/data/testimonials';
import { benefits } from '@/data/benefits';
import { carouselSlides } from '@/data/legends';
import { offer, site, alternativePayments, PENDING } from '@/data/site';

/**
 * Estos tests no comprueban que el contenido "esté bien escrito": comprueban las
 * reglas del proyecto, que son las que se pueden romper sin darse cuenta al
 * editar un archivo de datos meses después.
 *
 * La regla que atraviesa todo: nada sin confirmar puede acabar publicado como
 * afirmación cerrada ni emitido en datos estructurados.
 */

const uniqueIds = (items: readonly { id: string }[]): boolean =>
  new Set(items.map((item) => item.id)).size === items.length;

describe('preguntas frecuentes', () => {
  it('excluye del JSON-LD toda pregunta marcada como pendiente', () => {
    const pendingIds = faq.filter((item) => item.pending).map((item) => item.id);
    expect(pendingIds.length).toBeGreaterThan(0);

    for (const id of pendingIds) {
      expect(structuredFaq.some((item) => item.id === id)).toBe(false);
    }
  });

  it('sigue mostrando las pendientes en la página', () => {
    // Se excluyen del JSON-LD, no de la interfaz: la objeción hay que atenderla.
    expect(faq.length).toBeGreaterThan(structuredFaq.length);
  });

  it('deriva al contacto en las respuestas pendientes en vez de inventar una política', () => {
    for (const item of faq.filter((entry) => entry.pending)) {
      const defersToContact =
        item.answer.includes(site.contactEmail) || item.answer.includes('escríbenos');
      const isFactual = item.id === 'grabadas' || item.id === 'feedback';
      expect(defersToContact || isFactual).toBe(true);
    }
  });

  it('no deja ninguna respuesta vacía y los identificadores son únicos', () => {
    expect(uniqueIds(faq)).toBe(true);
    for (const item of faq) {
      expect(item.question.trim().length).toBeGreaterThan(0);
      expect(item.answer.trim().length).toBeGreaterThan(0);
    }
  });
});

describe('estadísticas', () => {
  it('marca como no verificada la cifra de jugadores', () => {
    const players = stats.find((stat) => stat.id === 'players');
    expect(players).toBeDefined();
    expect(players?.verified).toBe(false);
  });

  it('acompaña con una nota toda cifra sin verificar', () => {
    for (const stat of stats.filter((entry) => !entry.verified)) {
      expect(stat.note?.trim().length ?? 0).toBeGreaterThan(0);
    }
  });

  it('mantiene la microprueba del hero alineada con los datos', () => {
    expect(heroProofItems.length).toBeGreaterThan(0);
    expect(heroProofItems.some((item) => item.includes('221'))).toBe(true);
  });
});

describe('testimonios', () => {
  it('solo publica como spotlight los que tienen cita textual', () => {
    for (const item of spotlightTestimonials) {
      expect(item.quote.trim().length).toBeGreaterThan(0);
      expect(item.verified).toBe(true);
    }
  });

  it('deja en el roster a quien no tiene cita confirmada', () => {
    for (const item of rosterMembers) {
      expect(item.quote).toBeUndefined();
    }
  });

  it('no pierde ni duplica a nadie al repartir entre spotlight y roster', () => {
    expect(spotlightTestimonials.length + rosterMembers.length).toBe(testimonials.length);
    expect(uniqueIds(testimonials)).toBe(true);
  });

  it('nunca inventa un resultado: si hay rango de salida, hay rango de llegada', () => {
    for (const item of testimonials) {
      expect(Boolean(item.rankFrom)).toBe(Boolean(item.rankTo));
    }
  });
});

describe('pilares', () => {
  it('mantiene exactamente cuatro, como pide el brief', () => {
    expect(benefits).toHaveLength(4);
    expect(carouselSlides).toHaveLength(4);
  });

  it('empareja cada diapositiva con su pilar', () => {
    for (const slide of carouselSlides) {
      expect(benefits.some((benefit) => benefit.id === slide.id)).toBe(true);
    }
  });

  it('declara un modo de render válido en cada diapositiva', () => {
    // Meter un recorte con alfa en una caja apaisada lo deja flotando en un
    // rectángulo vacío: por eso el modo va por asset, no por posición.
    for (const slide of carouselSlides) {
      expect(['cutout', 'scene']).toContain(slide.kind);
    }
    expect(carouselSlides.filter((slide) => slide.kind === 'cutout')).toHaveLength(1);
  });

  it('usa formatos de recorte y de acento que el CSS sabe interpretar', () => {
    for (const slide of carouselSlides) {
      expect(slide.focus).toMatch(/^\d{1,3}% \d{1,3}%$/);
      // `r g b` sin comas: se compone como `rgb(x / alpha)`.
      expect(slide.accent).toMatch(/^\d{1,3} \d{1,3} \d{1,3}$/);
    }
  });

  it('describe cada imagen con un alt no vacío', () => {
    for (const slide of carouselSlides) {
      expect(slide.imageAlt.trim().length).toBeGreaterThan(0);
    }
  });

  it('no repite identificadores', () => {
    expect(uniqueIds(carouselSlides)).toBe(true);
    expect(uniqueIds(benefits)).toBe(true);
  });
});

describe('oferta', () => {
  it('mantiene el precio del brief', () => {
    expect(offer.price).toBe(500);
    expect(offer.currency).toBe('MXN');
  });

  it('apunta el checkout a una URL segura', () => {
    expect(offer.checkoutUrl.startsWith('https://')).toBe(true);
  });

  it('conserva los métodos alternativos con su aviso de comprobante', () => {
    expect(alternativePayments.length).toBeGreaterThan(0);
    for (const method of alternativePayments) {
      expect(method.detail.trim().length).toBeGreaterThan(0);
      expect(method.hint.toLowerCase()).toContain('comprobante');
    }
  });

  it('deja constancia de los datos que faltan por confirmar', () => {
    expect(PENDING.length).toBeGreaterThan(0);
  });
});
