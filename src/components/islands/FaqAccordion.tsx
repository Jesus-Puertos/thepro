import { ChevronDown } from 'lucide-react';

import { trackEvent } from '@/lib/analytics';
import type { FaqItem } from '@/types';

interface FaqAccordionProps {
  items: FaqItem[];
}

/**
 * Acordeón construido sobre `<details>` / `<summary>` nativos.
 *
 * Es una decisión deliberada: la semántica de expandir/plegar, el manejo de
 * teclado y `aria-expanded` los da el navegador, y las respuestas siguen siendo
 * legibles aunque el JavaScript no llegue a cargar. React solo añade el registro
 * de analítica encima.
 */
export default function FaqAccordion({ items }: FaqAccordionProps) {
  const handleToggle = (item: FaqItem) => (event: React.SyntheticEvent<HTMLDetailsElement>) => {
    if (!event.currentTarget.open) return;
    trackEvent('faq_open', { question: item.id });
  };

  return (
    <div className="flex flex-col">
      {items.map((item, index) => (
        <details
          key={item.id}
          onToggle={handleToggle(item)}
          className="faq-item group border-t border-(--color-border) last:border-b"
        >
          <summary className="flex w-full cursor-pointer items-start gap-4 py-5 sm:gap-6">
            <span className="label-tech text-red/80 mt-1.5 shrink-0 tabular-nums">
              {String(index + 1).padStart(2, '0')}
            </span>

            <span className="h4 text-white group-hover:text-gold flex-1 transition-colors">
              {item.question}
            </span>

            <span className="faq-chevron text-muted mt-0.5 shrink-0">
              <ChevronDown size={20} strokeWidth={2} aria-hidden="true" />
            </span>
          </summary>

          <div className="faq-answer pb-6 pl-[calc(1.5rem+1rem)] sm:pl-[calc(1.5rem+1.5rem)]">
            <p className="body-text max-w-2xl">{item.answer}</p>
          </div>
        </details>
      ))}
    </div>
  );
}
