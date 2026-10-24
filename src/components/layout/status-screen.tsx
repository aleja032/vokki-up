import type { ReactNode } from 'react';

interface StatusScreenProps {
  eyebrow: string;
  title: string;
  description: string;
  glyph: string;
  search?: ReactNode;
  children: ReactNode;
}

export function StatusScreen({
  eyebrow,
  title,
  description,
  glyph,
  search,
  children
}: StatusScreenProps) {
  return (
    <section className="status-screen">
      <div aria-hidden="true" className="status-screen__art">
        <span className="status-screen__card status-screen__card--back" />
        <span className="status-screen__card status-screen__card--front">
          {glyph}
        </span>
      </div>
      <p className="status-screen__eyebrow">{eyebrow}</p>
      <h1 className="status-screen__title">{title}</h1>
      <p className="status-screen__description">{description}</p>
      {search}
      <div className="status-screen__actions">{children}</div>
    </section>
  );
}
