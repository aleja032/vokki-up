'use client';

import { useId, useState } from 'react';
import { ChevronDown } from 'lucide-react';

type ReviewExampleEsProps = {
  label: string;
  sentence: string;
};

/**
 * Collapsed-by-default Spanish example: the eyebrow is the toggle. Mount it
 * with `key={card.id}` so the open state resets for every card.
 */
export function ReviewExampleEs({ label, sentence }: ReviewExampleEsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();

  return (
    <div className="drill-es" data-open={isOpen}>
      <button
        className="drill-es__toggle"
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen(open => !open)}
      >
        <span className="drill-es__label">{label}</span>
        <ChevronDown className="drill-es__chevron" size={14} aria-hidden />
      </button>
      <div className="drill-es__panel">
        <div
          className="drill-es__region"
          id={panelId}
          aria-hidden={!isOpen}
          inert={!isOpen}
        >
          <span className="drill-es__sentence">{sentence}</span>
        </div>
      </div>
    </div>
  );
}
