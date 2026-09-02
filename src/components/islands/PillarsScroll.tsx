import { useCallback, useEffect, useRef, useState } from 'react';
import { Check } from 'lucide-react';

import { trackEvent } from '@/lib/analytics';
import type { Benefit, CarouselSlide } from '@/types';

interface PillarsScrollProps {
  slides: CarouselSlide[];
  benefits: Benefit[];
}

/** Alto de scroll reservado a cada pilar, en vh. Cuatro pilares × 72 = 288vh. */
const STEP_VH = 72;

const EASE = 'cubic-bezier(0.4, 0, 0.2, 1)';

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

      /*
       * Al pasar al modo mejorado, esta sección cambia de ~1300 px a 288vh.
       * Todo lo que hay debajo se desplaza, y los ScrollTrigger que creó
       * `motion.ts` se quedan con posiciones calculadas antes del cambio: los
       * revelados dispararían a destiempo. Un refresco global lo recalcula todo.
       */
      requestAnimationFrame(() => ScrollTrigger.refresh());
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
        behavior: 'smooth',
      });
    },
    [slides.length],
  );

  if (!enhanced) {
    return <StackedPillars slides={slides} benefits={benefits} />;
  }

  const current = slides[active];

  return (
    <div ref={wrapperRef} className="relative" style={{ height: `${slides.length * STEP_VH}vh` }}>
      <div
        ref={stageRef}
        className="sticky top-0 flex h-svh flex-col overflow-hidden pt-(--header-h)"
        style={{ '--sub': 0 } as React.CSSProperties}
      >
        {/* Halo de acento: un div por pilar cruzando opacidades.
            Transicionar la propiedad `background` no sirve — los degradados no
            interpolan y el color pegaría un salto seco en vez de fundirse. */}
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 right-[18%] h-136 w-136 -translate-y-1/2 rounded-full"
            style={{
              background: `radial-gradient(circle, rgb(${slide.accent} / 0.2) 0%, rgb(${slide.accent} / 0.05) 46%, transparent 72%)`,
              opacity: index === active ? 1 : 0,
              transition: `opacity 650ms ${EASE}`,
            }}
          />
        ))}

        <div className="relative mx-auto grid w-full max-w-content flex-1 grid-cols-1 items-center gap-10 px-5 sm:px-8 lg:grid-cols-12 lg:px-10">
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

          {/* --- Escenario a sangre ---
              Sin marco a propósito: encajonar las imágenes le quita toda la
              fuerza, sobre todo al recorte del coach, que acaba flotando en un
              rectángulo vacío. Aquí cada pieza sangra y se funde con el negro. */}
          <div className="relative h-[52vh] max-h-[34rem] lg:col-span-7 lg:h-[64vh] lg:max-h-[42rem]">
            {/* La palabra va DETRÁS de la imagen. Como las piezas se disuelven
                por abajo, asoma por la banda inferior en las cuatro.
                Se apilan las cuatro y se cruzan opacidades: con `key` React
                remontaba el nodo y la palabra entraba de golpe. */}
            {slides.map((slide, index) => (
              <span
                key={slide.id}
                aria-hidden="true"
                className="ghost-text ghost-text--sm ghost-text--outline absolute bottom-[2%] left-1/2 z-0 -translate-x-1/2"
                style={{
                  opacity: index === active ? 1 : 0,
                  transition: `opacity 650ms ${EASE}`,
                }}
              >
                {slide.ghost}
              </span>
            ))}

            {slides.map((slide, index) => {
              const isActive = index === active;
              const isCutout = slide.kind === 'cutout';

              // La figura recortada va de pie y a toda altura; las piezas 16:9
              // llenan el escenario y se disuelven por el borde izquierdo.
              const mask = isCutout
                ? 'linear-gradient(to bottom, black 80%, transparent 100%)'
                : 'linear-gradient(to right, transparent 0%, black 24%), linear-gradient(to bottom, black 76%, transparent 100%)';

              return (
                <img
                  key={slide.id}
                  src={slide.image.src}
                  srcSet={slide.image.srcset || undefined}
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  width={slide.image.width}
                  height={slide.image.height}
                  alt=""
                  loading={index === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  className={`absolute inset-0 z-10 h-full w-full ${
                    isCutout ? 'object-contain object-bottom' : 'object-cover'
                  }`}
                  style={{
                    objectPosition: isCutout ? undefined : slide.focus,
                    opacity: isActive ? 1 : 0,
                    // El zoom se suelta conforme avanza el scroll dentro del paso.
                    // La activa NO lleva transición en `transform`: el valor ya
                    // cambia de forma continua con el scroll, y una transición
                    // encima lo dejaba persiguiendo un objetivo móvil con 900 ms
                    // de retraso — de ahí la sensación de blandura.
                    // La inactiva sí la lleva, para volver a su escala sin saltar
                    // mientras se desvanece.
                    transform: isActive
                      ? 'scale(calc(1.06 - var(--sub) * 0.06))'
                      : 'scale(1.06)',
                    transition: isActive
                      ? `opacity 650ms ${EASE}`
                      : `opacity 650ms ${EASE}, transform 650ms ${EASE}`,
                    filter: isCutout
                      ? 'contrast(1.06) saturate(0.85) brightness(0.95)'
                      : 'contrast(1.08) saturate(0.92) brightness(0.9)',
                    maskImage: mask,
                    WebkitMaskImage: mask,
                    maskComposite: isCutout ? undefined : 'intersect',
                    WebkitMaskComposite: isCutout ? undefined : 'source-in',
                  }}
                />
              );
            })}

            <div aria-hidden="true" className="scanlines z-20 opacity-20" />

            {/* Filo de acento que avanza con el scroll dentro del pilar. */}
            <div
              aria-hidden="true"
              className="absolute right-0 bottom-0 left-0 z-20 h-0.5 origin-left"
              style={{
                backgroundColor: current ? `rgb(${current.accent})` : undefined,
                transform: 'scaleX(var(--sub))',
              }}
            />
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
            <li key={slide.id} className="panel">
              <div className="panel-inner flex h-full flex-col">
                <figure className="relative m-0 aspect-16/9 overflow-hidden">
                  {/* Mismo criterio que en escritorio: el recorte va de pie y
                      la pieza 16:9 llena la caja. */}
                  <img
                    src={slide.image.src}
                    srcSet={slide.image.srcset || undefined}
                    sizes="(min-width: 640px) 45vw, 90vw"
                    width={slide.image.width}
                    height={slide.image.height}
                    alt={slide.image.alt}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                    className={`h-full w-full ${
                      slide.kind === 'cutout'
                        ? 'object-contain object-bottom'
                        : 'object-cover'
                    }`}
                    style={{
                      objectPosition: slide.kind === 'cutout' ? undefined : slide.focus,
                      filter: 'contrast(1.06) saturate(0.92) brightness(0.9)',
                    }}
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(to top, var(--color-surface) 2%, transparent 45%)',
                    }}
                  />
                  <div
                    aria-hidden="true"
                    className="absolute right-0 bottom-0 left-0 h-0.5"
                    style={{ backgroundColor: `rgb(${slide.accent})` }}
                  />
                </figure>

                <div className="flex flex-1 flex-col gap-3 p-6">
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
