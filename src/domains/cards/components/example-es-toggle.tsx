'use client';

import { useId, useState, type ReactNode } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cardsMessages } from '../messages';
import './example-es-toggle.css';

const messages = cardsMessages.exampleEsToggle;

type ExampleEsToggleProps = {
  /** Spanish translation of the example; without it nothing is added. */
  sentence: string | undefined;
  /** The English example as the surface already renders it. */
  children: ReactNode;
};

/**
 * Wraps an English example with an icon-only eye toggle that reveals its
 * Spanish translation below (collapsed by default, like a password eye).
 * Mount it with a `key` that changes per card so the state resets.
 */
export function ExampleEsToggle({ sentence, children }: ExampleEsToggleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const regionId = useId();

  if (!sentence) return <>{children}</>;

  const Icon = isOpen ? EyeOff : Eye;
  const label = isOpen ? messages.hide : messages.show;

  return (
    <div className="es-toggle" data-open={isOpen}>
      <div className="es-toggle__row">
        <div className="es-toggle__main">{children}</div>
        <button
          className="es-toggle__button"
          type="button"
          aria-expanded={isOpen}
          aria-controls={regionId}
          aria-label={label}
          title={label}
          onClick={() => setIsOpen(open => !open)}
        >
          <Icon size={18} aria-hidden />
        </button>
      </div>
      <span className="es-toggle__panel">
        <span
          className="es-toggle__region"
          id={regionId}
          aria-hidden={!isOpen}
          inert={!isOpen}
        >
          <span className="es-toggle__sentence">{sentence}</span>
        </span>
      </span>
    </div>
  );
}
