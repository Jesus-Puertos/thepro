import { useCallback, useEffect, useRef, useState } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';

import { trackEvent } from '@/lib/analytics';
import type { NavItem } from '@/types';

interface MobileMenuProps {
  items: NavItem[];
  checkoutUrl: string;
  ctaLabel: string;
  priceLabel: string;
}

const PANEL_ID = 'mobile-menu-panel';

/**
 * Navegación móvil accesible.
 * - Cierra con Escape y al elegir un enlace.
 * - Devuelve el foco al botón que la abrió.
 * - Bloquea el scroll del fondo mientras está abierta.
 * - Mantiene el foco dentro del panel (trampa de foco con Tab / Shift+Tab).
 */
export default function MobileMenu({
  items,
  checkoutUrl,
  ctaLabel,
  priceLabel,
}: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;

    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = 'hidden';

    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>('a, button')?.focus();

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
        return;
      }

      if (event.key !== 'Tab' || !panel) return;

      const focusables = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return () => {
      body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, close]);

  const handleToggle = (): void => {
    setOpen((current) => {
      if (!current) trackEvent('mobile_menu_open');
      return !current;
    });
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={handleToggle}
        aria-expanded={open}
        aria-controls={PANEL_ID}
        aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
        className="text-white hover:text-gold flex h-11 w-11 items-center justify-center transition-colors lg:hidden"
      >
        {open ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
      </button>

      {/* Fondo. Decorativo: el cierre accesible es Escape o el botón. */}
      <div
        onClick={close}
        aria-hidden="true"
        className={`bg-background/80 fixed inset-0 z-40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <div
        id={PANEL_ID}
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
        inert={!open}
        className={`bg-surface fixed top-0 right-0 z-40 flex h-dvh w-[min(86vw,22rem)] flex-col gap-8 overflow-y-auto px-6 pt-[calc(var(--header-h)+1.5rem)] pb-8 shadow-[-1px_0_0_0_var(--color-border)] transition-transform duration-380 ease-in-out lg:hidden ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div aria-hidden="true" className="tech-grid tech-grid--dense opacity-60" />

        <nav className="relative">
          <p className="eyebrow tick-red mb-5">Navegación</p>
          <ul className="flex flex-col">
            {items.map((item, index) => (
              <li key={item.href} className="border-t border-(--color-border)">
                <a
                  href={item.href}
                  onClick={close}
                  className="display text-white hover:text-red flex items-center justify-between gap-3 py-4 text-2xl transition-colors"
                >
                  {item.label}
                  <span className="label-tech text-muted tabular-nums">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="relative mt-auto flex flex-col gap-3">
          <p className="stat-value text-white">{priceLabel}</p>
          <a
            href={checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={close}
            data-track="nav_cta_click"
            className="primary-button w-full"
          >
            {ctaLabel}
            <ArrowRight size={17} strokeWidth={2.25} className="btn-arrow shrink-0" />
          </a>
        </div>
      </div>
    </>
  );
}
