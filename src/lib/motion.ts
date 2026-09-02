/**
 * Orquestación de animaciones con GSAP.
 *
 * Contrato con el CSS (`src/styles/animations.css`):
 *  - Sin `.motion-ready` en <html>, todo está visible y este módulo no hace nada.
 *  - Al arrancar marca `.motion-armed`, que desactiva el failsafe del layout.
 *  - Cada elemento recibe `data-revealed` en cuanto se crea su animación. Desde
 *    ese momento ninguna regla CSS puede volver a ocultarlo, que es lo que hace
 *    seguro usar `clearProps` al terminar.
 *
 * El orden de cada revelado es siempre el mismo y es deliberado:
 *   1. `gsap.set(...)` fija el estado inicial como estilo en línea.
 *   2. `markRevealed(...)` retira la dependencia del CSS.
 *   3. `gsap.to(...)` anima hasta el estado final.
 * Así no hay parpadeo y en ningún momento la visibilidad depende de una regla
 * que un `clearProps` pueda reactivar.
 *
 * Marcado esperado:
 *  - `[data-hero-line]` dentro de `.line-mask` → revelado por línea.
 *  - `[data-reveal="up|fade|left|scale|rule"]` → revelado genérico.
 *  - `[data-hero]` → se anima en la línea de tiempo del hero, no con scroll.
 *  - `[data-parallax="0.15"]` → parallax suave (solo puntero fino y ≥1024px).
 *
 * REGLA: `data-reveal` nunca puede aparecer dentro de una isla de React. Ver
 * `revealTargets()` más abajo.
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const REVEAL_SELECTOR = '[data-reveal]:not([data-hero]):not([data-reveal="rule"])';

/**
 * Elementos que GSAP puede animar.
 *
 * Se descarta todo lo que viva dentro de una isla de React. Ese DOM lo posee
 * React: si GSAP le escribe estilos y un `data-revealed` antes de que hidrate,
 * React encuentra atributos que él no renderizó y lanza un error de hidratación
 * ("some attributes of the server rendered HTML didn't match"). Las islas se
 * encargan de sus propias animaciones.
 *
 * Se filtra con `closest()` en vez de con `:not(astro-island *)` porque el
 * soporte de selectores complejos dentro de `:not()` es más irregular.
 */
function revealTargets(selector: string): HTMLElement[] {
  return gsap.utils
    .toArray<HTMLElement>(selector)
    .filter((element) => !element.closest('astro-island'));
}

/** Estados iniciales. Deben coincidir con `src/styles/animations.css`. */
const FROM_STATE = {
  opacity: 0,
  y: (_i: number, el: Element) =>
    (el as HTMLElement).dataset.reveal === 'up' ? 44 : 0,
  x: (_i: number, el: Element) =>
    (el as HTMLElement).dataset.reveal === 'left' ? -32 : 0,
  scale: (_i: number, el: Element) =>
    (el as HTMLElement).dataset.reveal === 'scale' ? 0.97 : 1,
};

/**
 * Marca los elementos como revelados.
 * A partir de aquí el CSS ya no los oculta pase lo que pase con el tween.
 */
function markRevealed(elements: readonly Element[]): void {
  for (const element of elements) element.setAttribute('data-revealed', '');
}

export function initMotion(): void {
  const root = document.documentElement;
  if (!root.classList.contains('motion-ready')) return;

  try {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });

    const ctx = gsap.context(() => {
      buildHeroTimeline();
      buildScrollReveals();
      buildParallax();
    });

    // Solo ahora se desactiva el failsafe: si algo de lo anterior falla, la
    // clase sigue puesta y el layout devuelve la visibilidad por su cuenta.
    root.classList.add('motion-armed');

    // Recalcula posiciones cuando las fuentes cambian las métricas del texto.
    void document.fonts?.ready.then(() => ScrollTrigger.refresh());

    scheduleSafetySweep();

    window.addEventListener('pagehide', () => ctx.revert(), { once: true });
  } catch (error) {
    // Ante cualquier fallo, el contenido manda: se retira la compuerta entera.
    root.classList.remove('motion-ready', 'motion-armed');
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.error('[motion] animaciones desactivadas', error);
    }
  }
}

function buildHeroTimeline(): void {
  const lines = revealTargets('[data-hero-line]');
  const items = revealTargets('[data-reveal][data-hero]');

  if (lines.length === 0 && items.length === 0) return;

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.1 });

  if (lines.length > 0) {
    gsap.set(lines, { yPercent: 110 });
    markRevealed(lines);

    tl.to(lines, {
      yPercent: 0,
      duration: 0.9,
      stagger: 0.08,
      onComplete: () => gsap.set(lines, { clearProps: 'transform' }),
    });
  }

  if (items.length > 0) {
    gsap.set(items, FROM_STATE);
    markRevealed(items);

    tl.to(
      items,
      {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.7,
        stagger: 0.09,
        onComplete: () => gsap.set(items, { clearProps: 'opacity,transform' }),
      },
      lines.length > 0 ? '-=0.6' : 0,
    );
  }
}

function buildScrollReveals(): void {
  ScrollTrigger.batch(revealTargets(REVEAL_SELECTOR), {
    start: 'top 88%',
    once: true,
    onEnter: (batch) => {
      gsap.set(batch, FROM_STATE);
      markRevealed(batch);

      gsap.to(batch, {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.7,
        stagger: 0.08,
        ease: 'power3.out',
        onComplete: () => gsap.set(batch, { clearProps: 'opacity,transform' }),
      });
    },
  });

  // Reglas horizontales que se dibujan de izquierda a derecha.
  ScrollTrigger.batch(revealTargets('[data-reveal="rule"]'), {
    start: 'top 92%',
    once: true,
    onEnter: (batch) => {
      gsap.set(batch, { scaleX: 0, transformOrigin: 'left center' });
      markRevealed(batch);

      gsap.to(batch, {
        scaleX: 1,
        duration: 0.9,
        stagger: 0.1,
        ease: 'power3.inOut',
        onComplete: () => gsap.set(batch, { clearProps: 'transform' }),
      });
    },
  });
}

/**
 * Red de seguridad.
 *
 * Si por lo que sea ScrollTrigger no dispara para algo que ya está en pantalla
 * (una recarga a media página, un `refresh` a destiempo), esto lo hace visible
 * en lugar de dejar un hueco en blanco. No toca lo que sigue por debajo del
 * pliegue, así que las animaciones de scroll se conservan intactas.
 */
function scheduleSafetySweep(): void {
  window.setTimeout(() => {
    const pending = revealTargets(
      '[data-reveal]:not([data-revealed]), [data-hero-line]:not([data-revealed])',
    );

    for (const element of pending) {
      if (element.getBoundingClientRect().top > window.innerHeight) continue;
      element.setAttribute('data-revealed', '');
      gsap.set(element, { clearProps: 'opacity,transform' });
    }
  }, 4000);
}

function buildParallax(): void {
  // Parallax solo donde aporta y no cuesta: puntero fino y pantalla grande.
  if (!window.matchMedia('(min-width: 1024px) and (pointer: fine)').matches) return;

  const layers = gsap.utils.toArray<HTMLElement>('[data-parallax]');

  for (const layer of layers) {
    const strength = Number.parseFloat(layer.dataset.parallax ?? '0.12');
    if (!Number.isFinite(strength) || strength === 0) continue;

    gsap.to(layer, {
      yPercent: strength * 100,
      ease: 'none',
      scrollTrigger: {
        trigger: layer.closest('section') ?? layer,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.6,
      },
    });
  }
}
