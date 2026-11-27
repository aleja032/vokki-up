import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ArchCard } from './arch-card';

const base = {
  href: '/cards/word-library?world=daily',
  stateLabel: 'En curso',
  title: 'Día a día',
  description: 'Rutina, casa, compras y calle',
  progress: { value: 46, max: 200, label: 'Día a día: 46/200' }
};

describe('ArchCard', () => {
  it('is a link with the title, description and progress', () => {
    const html = renderToStaticMarkup(<ArchCard {...base} />);

    expect(html).toContain('href="/cards/word-library?world=daily"');
    expect(html).toContain('Día a día');
    expect(html).toContain('Rutina, casa, compras y calle');
    expect(html).toContain('46/200');
    expect(html).toContain('role="progressbar"');
    expect(html).toContain('aria-valuenow="46"');
  });

  it('renders the pixel art when active and the icon otherwise', () => {
    const active = renderToStaticMarkup(
      <ArchCard
        {...base}
        imageSrc="/images/world-daily.png"
        isActive
        icon={<svg data-testid="icon" />}
      />
    );
    const idle = renderToStaticMarkup(
      <ArchCard {...base} icon={<svg data-testid="icon" />} />
    );

    expect(active).toContain('data-state="active"');
    expect(active).toContain('world-daily.png');
    expect(active).not.toContain('data-testid="icon"');
    expect(idle).toContain('data-state="idle"');
    expect(idle).toContain('data-testid="icon"');
    expect(idle).not.toContain('<img');
  });

  it('shows art on idle cards too, with a facts line and an accent', () => {
    const html = renderToStaticMarkup(
      <ArchCard
        {...base}
        accent="mint"
        imageSrc="/images/world-travel.svg"
        meta="200 palabras · 0 en tu mazo"
      />
    );

    expect(html).toContain('data-state="idle"');
    expect(html).toContain('data-art="true"');
    expect(html).toContain('data-accent="mint"');
    expect(html).toContain('world-travel.svg');
    expect(html).toContain('200 palabras · 0 en tu mazo');
    // Not started: gray veil over the art; it disappears once the world is active.
    expect(html).toContain('arch-card__veil');
    expect(
      renderToStaticMarkup(
        <ArchCard {...base} imageSrc="/images/world-travel.svg" isActive />
      )
    ).not.toContain('arch-card__veil');
  });

  it('omits the description when there is none', () => {
    const html = renderToStaticMarkup(
      <ArchCard {...base} description={undefined} />
    );

    expect(html).not.toContain('arch-card__description');
  });
});
