import { useCallback, useEffect, useRef, useState } from 'react';
import { Check } from 'lucide-react';

import { trackEvent } from '@/lib/analytics';
import type { Benefit, CarouselSlide } from '@/types';

interface PillarsScrollProps {
  slides: CarouselSlide[];
  benefits: Benefit[];
}

type SlotRole = 'center' | 'left' | 'right' | 'back';

/** Colocación de cada figura según su papel en la rotación. */
const SLOTS: Record<SlotRole, { transform: string; opacity: number; blur: number; z: number }> = {
  center: { transform: 'translateX(0) scale(1)', opacity: 1, blur: 0, z: 30 },
  left: { transform: 'translateX(-58%) scale(0.58)', opacity: 0.26, blur: 3, z: 20 },
  right: { transform: 'translateX(58%) scale(0.58)', opacity: 0.26, blur: 3, z: 20 },
  back: { transform: 'translateY(-8%) scale(0.38)', opacity: 0.12, blur: 4.5, z: 10 },
};

/** Alto de scroll reservado a cada pilar, en vh. */
const STEP_VH = 85;

/**
 * Los cuatro pilares, recorridos con el scroll.
 *
 * Dos modos, y el que se ve depende del dispositivo:
 *
 *  - **Base** (servidor, móvil, tablet, sin JavaScript o con `prefers-reduced-motion`):
 *    los cuatro pilares en una rejilla, uno debajo de otro. Es el contenido
 *    completo y accesible; no hace falta ningún `<noscript>` aparte.
 *
 *  - **Mejorado** (escritorio con JS y sin restricción de movimiento): el escenario
 *    se queda fijo con `position: sticky` y GSAP ScrollTrigger convierte el avance
 *    del scroll en el pilar activo.
 *
 * El pin lo hace CSS con `sticky`, no GSAP: sin `pin-spacer` no hay saltos de
 * maquetación. ScrollTrigger solo informa del progreso.
 *
 * El progreso dentro de cada paso se escribe en la variable CSS `--sub` mediante
 * una `ref`, no en el estado de React: así solo se re-renderiza al cambiar de
 * pilar y no en cada fotograma de scroll.
 */
export default function PillarsScroll({ slides, benefits }: PillarsScrollProps) {
  const [active, setActive] = useState(0);
  const [enhanced, setEnhanced] = useState(false);
  const [mounted, setMounted] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);

    const query = window.matchMedia(
      '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
    );
    const sync = (): void => setEnhanced(query.matches);
    sync();
    query.addEventListener('change', sync);

    return () => query.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!enhanced || !wrapper) return;

    let cancelled = false;
    let trigger: { kill: () => void } | undefined;

    void (async () => {
      // GSAP solo se descarga si de verdad vamos a usarlo.
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      trigger = ScrollTrigger.create({
        trigger: wrapper,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          const raw = self.progress * slides.length;
          const index = Math.min(slides.length - 1, Math.floor(raw));

          stageRef.current?.style.setProperty('--sub', String(Math.min(1, raw - index)));
          setActive((current) => (current === index ? current : index));
        },
      });
    })();

    return () => {
      cancelled = true;
      trigger?.kill();
    };
  }, [enhanced, slides.length]);

  useEffect(() => {
    if (!enhanced) return;
    const slide = slides[active];
    if (slide) trackEvent('carousel_interaction', { pillar: slide.id, source: 'scroll' });
  }, [active, enhanced, slides]);

  /** Salta al pilar elegido desde la barra de progreso. */
  const goTo = useCallback(
    (index: number) => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;

      const top = wrapper.getBoundingClientRect().top + window.scrollY;
      const scrollable = wrapper.offsetHeight - window.innerHeight;

      window.scrollTo({
        top: top + (scrollable * index) / slides.length + 4,
        behavior: 'matchMedia' in window ? 'smooth' : 'auto',
      });
    },
    [slides.length],
  );

  const roleFor = (index: number): SlotRole => {
    const distance = (index - active + slides.length) % slides.length;
    if (distance === 0) return 'center';
    if (distance === 1) return 'right';
    if (distance === slides.length - 1) return 'left';
    return 'back';
  };

  if (!enhanced) {
    return <StackedPillars slides={slides} benefits={benefits} />;
  }

  const current = slides[active];

  return (
    <div
      ref={wrapperRef}
      className="relative"
      style={{ height: `${slides.length * STEP_VH}vh` }}
    >
      <div
        ref={stageRef}
        className="sticky top-0 flex h-svh flex-col overflow-hidden pt-(--header-h)"
        style={{ '--sub': 0 } as React.CSSProperties}
      >
        {/* Halo de acento, sincronizado con el pilar activo. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-[26%] h-136 w-136 -translate-y-1/2 rounded-full"
          style={{
            background: current
              ? `radial-gradient(circle, rgb(${current.accent} / 0.22) 0%, rgb(${current.accent} / 0.06) 44%, transparent 72%)`
              : undefined,
            transition: 'background 650ms cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />

        <div
          aria-hidden="true"
          className="ghost-text ghost-text--sm ghost-text--outline absolute top-1/2 right-[6%] -translate-y-1/2"
          key={current?.ghost}
        >
          {current?.ghost}
        </div>

        <div className="relative mx-auto grid w-full max-w-content flex-1 grid-cols-1 items-center gap-8 px-5 sm:px-8 lg:grid-cols-12 lg:px-10">
          {/* --- Panel de texto: los cuatro apilados en la misma celda --- */}
          <div className="grid lg:col-span-5">
            {slides.map((slide, index) => {
              const benefit = benefits.find((item) => item.id === slide.id);
              const isActive = index === active;

              return (
                <article
                  key={slide.id}
                  aria-hidden={mounted && !isActive}
                  className="col-start-1 row-start-1 flex flex-col gap-5 transition-[opacity,transform] duration-500 ease-out"
                  style={{
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? 'none' : 'translateY(28px)',
                    pointerEvents: isActive ? undefined : 'none',
                  }}
                >
                  <p className="eyebrow flex items-center gap-3">
                    <span
                      className="font-bold tabular-nums"
                      style={{ color: `rgb(${slide.accent})` }}
                    >
                      {slide.index}
                    </span>
                    <span aria-hidden="true" className="h-px w-6 bg-white/25" />
                    <span>{slide.kicker}</span>
                  </p>

                  <h3 className="h2 text-white">{slide.title}</h3>
                  <p className="body-text max-w-md">{slide.description}</p>

                  {benefit && (
                    <ul className="mt-1 flex flex-col gap-2.5">
                      {benefit.items.map((item) => (
                        <li key={item} className="body-text-sm flex items-start gap-3">
                          <Check
                            size={15}
                            strokeWidth={2.5}
                            aria-hidden="true"
                            className="mt-1 shrink-0"
                            style={{ color: `rgb(${slide.accent})` }}
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <p
                    className="label-tech mt-1 inline-flex w-fit items-center px-3 py-2"
                    style={{
                      color: `rgb(${slide.accent})`,
                      boxShadow: `inset 0 0 0 1px rgb(${slide.accent} / 0.35)`,
                    }}
                  >
                    {slide.highlight}
                  </p>
                </article>
              );
            })}
          </div>

          {/* --- Escenario de figuras --- */}
          <div className="relative h-104 lg:col-span-7 lg:h-136">
            {slides.map((slide, index) => {
              const slot = SLOTS[roleFor(index)];

              return (
                <figure
                  key={slide.id}
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 bottom-0 m-0 flex items-end justify-center"
                  style={{
                    transform: slot.transform,
                    opacity: slot.opacity,
                    filter: slot.blur > 0 ? `blur(${slot.blur}px)` : undefined,
                    zIndex: slot.z,
                    transition:
                      'transform 650ms cubic-bezier(0.4, 0, 0.2, 1), opacity 650ms cubic-bezier(0.4, 0, 0.2, 1), filter 650ms cubic-bezier(0.4, 0, 0.2, 1)',
                    willChange: 'transform, opacity',
                  }}
                >
                  <img
                    src={slide.image.src}
                    srcSet={slide.image.srcset || undefined}
                    sizes="(min-width: 1024px) 34rem, 80vw"
                    width={slide.image.width}
                    height={slide.image.height}
                    alt=""
                    loading={index === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                    className="h-full w-auto max-w-none object-contain object-bottom"
                    style={{
                      transform: `translateX(${(50 - slide.focusX).toFixed(1)}%)`,
                      filter:
                        slide.id === 'coaching'
                          ? 'contrast(1.05) saturate(0.8) brightness(0.95)'
                          : 'grayscale(1) contrast(1.15) brightness(0.9)',
                      maskImage: 'linear-gradient(to bottom, black 82%, transparent 100%)',
                      WebkitMaskImage:
                        'linear-gradient(to bottom, black 82%, transparent 100%)',
                    }}
                  />
                </figure>
              );
            })}
          </div>
        </div>

        {/* --- Barra de progreso, también navegable con clic y teclado --- */}
        <nav
          aria-label="Pilares del programa"
          className="relative mx-auto w-full max-w-content px-5 pb-8 sm:px-8 lg:px-10"
        >
          <ol className="flex gap-3">
            {slides.map((slide, index) => (
              <li key={slide.id} className="min-w-0 flex-1">
                <button
                  type="button"
                  onClick={() => goTo(index)}
                  aria-current={index === active ? 'step' : undefined}
                  className="group block w-full cursor-pointer pt-3 pb-1 text-left"
                >
                  <span className="block h-0.5 w-full bg-white/12">
                    <span
                      className="block h-full origin-left"
                      style={{
                        backgroundColor: `rgb(${slide.accent})`,
                        transform:
                          index < active
                            ? 'scaleX(1)'
                            : index === active
                              ? 'scaleX(var(--sub))'
                              : 'scaleX(0)',
                      }}
                    />
                  </span>
                  <span
                    className="label-tech mt-2.5 block truncate transition-colors"
                    style={{ color: index === active ? 'var(--color-white)' : undefined }}
                  >
                    {slide.index} · {slide.title}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  );
}

/**
 * Versión base: los cuatro pilares uno debajo de otro.
 * Es lo que se renderiza en el servidor, así que el contenido completo existe
 * en el HTML aunque el JavaScript nunca llegue a ejecutarse.
 */
function StackedPillars({ slides, benefits }: PillarsScrollProps) {
  return (
    <div className="mx-auto w-full max-w-content px-5 sm:px-8 lg:px-10">
      <ul className="grid gap-6 sm:grid-cols-2">
        {slides.map((slide, index) => {
          const benefit = benefits.find((item) => item.id === slide.id);

          return (
            <li key={slide.id} className="panel" data-reveal="up">
              <div className="panel-inner flex h-full flex-col">
                <figure className="relative m-0 h-44 overflow-hidden">
                  <div
                    aria-hidden="true"
                    className="absolute inset-0"
                    style={{
                      background: `radial-gradient(circle at 50% 80%, rgb(${slide.accent} / 0.2) 0%, transparent 68%)`,
                    }}
                  />
                  <img
                    src={slide.image.src}
                    srcSet={slide.image.srcset || undefined}
                    sizes="(min-width: 640px) 45vw, 90vw"
                    width={slide.image.width}
                    height={slide.image.height}
                    alt=""
                    loading={index === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                    className="relative h-full w-auto max-w-none object-contain object-bottom"
                    style={{
                      margin: '0 auto',
                      transform: `translateX(${(50 - slide.focusX).toFixed(1)}%)`,
                      filter:
                        slide.id === 'coaching'
                          ? 'contrast(1.05) saturate(0.8) brightness(0.95)'
                          : 'grayscale(1) contrast(1.15) brightness(0.9)',
                      maskImage: 'linear-gradient(to bottom, black 74%, transparent 100%)',
                      WebkitMaskImage:
                        'linear-gradient(to bottom, black 74%, transparent 100%)',
                    }}
                  />
                </figure>

                <div className="flex flex-1 flex-col gap-3 p-6 pt-0">
                  <p className="eyebrow flex items-center gap-3">
                    <span
                      className="font-bold tabular-nums"
                      style={{ color: `rgb(${slide.accent})` }}
                    >
                      {slide.index}
                    </span>
                    <span aria-hidden="true" className="h-px w-5 bg-white/25" />
                    <span>{slide.kicker}</span>
                  </p>

                  <h3 className="h3 text-white">{slide.title}</h3>
                  <p className="body-text">{slide.description}</p>

                  {benefit && (
                    <ul className="mt-1 flex flex-col gap-2">
                      {benefit.items.map((item) => (
                        <li key={item} className="body-text-sm flex items-start gap-3">
                          <Check
                            size={14}
                            strokeWidth={2.5}
                            aria-hidden="true"
                            className="mt-1 shrink-0"
                            style={{ color: `rgb(${slide.accent})` }}
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
