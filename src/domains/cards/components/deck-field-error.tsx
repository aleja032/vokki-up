import type { ReactNode } from 'react';
import { DeckIcon } from './deck-icon';

type DeckFieldErrorProps = {
  id: string;
  role?: 'alert';
  children: ReactNode;
};

export function DeckFieldError({ id, role, children }: DeckFieldErrorProps) {
  return (
    <span className="deck-field__error" id={id} role={role}>
      <DeckIcon name="alertCircle" size={16} />
      {children}
    </span>
  );
}
