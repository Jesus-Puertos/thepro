import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Quote } from 'lucide-react';

import { trackEvent } from '@/lib/analytics';
import type { Testimonial } from '@/types';

interface TestimonialCarouselProps {
  items: Testimonial[];
}

const SWIPE_THRESHOLD = 44;

/**
 * Carrusel de testimonios en formato "Player Spotlight".
 *
 * Solo recibe testimonios con cita confirmada. Si únicamente hay uno, se
 * comporta como una tarjeta estática y no muestra controles: un carrusel de un
 * solo elemento confunde más de lo que aporta.
 */
export default function TestimonialCarousel({ items }: TestimonialCarouselProps) {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const hasControls = items.length > 1;

  const go = useCallback(
    (direction: 1 | -1) => {
      setIndex((current) => (current + direction + items.length) % items.length);
      trackEvent('testimonial_interaction', { direction: direction === 1 ? 'next' : 'prev' });
    },
    [items.length],
  );

  useEffect(() => {
    if (index < items.length) return;
    setIndex(0);
  }, [index, items.length]);

  const current = items[index];
  if (!current) return null;

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (!hasControls) return;
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      go(1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      go(-1);
    }
  };

  const onTouchEnd = (event: React.TouchEvent<HTMLDivElement>): void => {
    if (!hasControls) return;
    const start = touchStartX.current;
    const end = event.changedTouches[0]?.clientX;
    touchStartX.current = null;
    if (start === null || end === undefined) return;

    const delta = end - start;
    if (Math.abs(delta) < SWIPE_THRESHOLD) return;
    go(delta < 0 ? 1 : -1);
  };

  return (
    <div
      role={hasControls ? 'group' : undefined}
      aria-roledescription={hasControls ? 'carrusel' : undefined}
      aria-label={hasControls ? 'Testimonios de jugadores' : undefined}
      tabIndex={hasControls ? 0 : undefined}
      onKeyDown={onKeyDown}
      onTouchStart={(event) => {
        touchStartX.current = event.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={onTouchEnd}
      className="flex flex-col gap-6"
    >
      <div className="panel" style={{ '--cut': '22px' } as React.CSSProperties}>
        <div
          className="panel-inner relative grid gap-8 p-6 sm:p-10 lg:grid-cols-[1fr_1.4fr] lg:gap-12"
          aria-live={hasControls ? 'polite' : undefined}
          aria-atomic="true"
        >
          <span
            aria-hidden="true"
            className="ghost-text ghost-text--sm absolute -top-6 -right-4 opacity-70"
          >
            {current.rankTo?.toUpperCase() ?? 'PRIME'}
          </span>

          <div className="relative flex flex-col gap-4">
            <p className="eyebrow tick-red">Player spotlight</p>

            <p className="display text-white text-3xl sm:text-4xl">{current.handle}</p>

            <p className="label-tech text-muted">
              {current.platform}
              {current.role ? ` · ${current.role}` : ' player'}
            </p>

            {current.rankFrom && current.rankTo && (
              <p className="mt-2 flex flex-wrap items-center gap-3">
                <span className="display text-white/45 text-2xl">{current.rankFrom}</span>
                <ArrowRight size={18} className="text-red shrink-0" aria-hidden="true" />
                <span className="display text-gold text-2xl">{current.rankTo}</span>
              </p>
            )}

            {current.availability && (
              <p className="body-text-sm mt-1">
                Tiempo disponible: {current.availability.toLowerCase()}
              </p>
            )}
          </div>

          <figure className="relative m-0 flex flex-col gap-5 lg:border-l lg:border-(--color-border) lg:pl-12">
            <Quote size={26} className="text-red/70 shrink-0" aria-hidden="true" />
            <blockquote className="lead text-white/85 text-balance">
              «{current.quote}»
            </blockquote>
            <figcaption className="label-tech text-muted">
              {current.handle} · {current.platform}
            </figcaption>
          </figure>
        </div>
      </div>

      {hasControls && (
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Testimonio anterior"
              className="ghost-button min-h-12! w-12 px-0!"
            >
              <ArrowLeft size={18} strokeWidth={2.25} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Testimonio siguiente"
              className="ghost-button min-h-12! w-12 px-0!"
            >
              <ArrowRight size={18} strokeWidth={2.25} aria-hidden="true" />
            </button>
          </div>

          <p className="label-tech text-muted tabular-nums">
            {String(index + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
          </p>
        </div>
      )}
    </div>
  );
}
