import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type { WorldProgress } from '@/lib/home/home-hand.types';
import { WorldsRow } from './worlds-row';

const worlds: WorldProgress[] = [
  { id: 'daily', name: 'Día a día', learned: 46, total: 200 },
  { id: 'work', name: 'Trabajo', learned: 0, total: 180 }
];

describe('WorldsRow', () => {
  it('renders a card per world with its progress', () => {
    const html = renderToStaticMarkup(<WorldsRow worlds={worlds} />);

    expect(html).toContain('Mundos');
    expect(html.match(/class="world-arch"/g)).toHaveLength(2);
    expect(html).toContain('46/200');
    expect(html).toContain('0/180');
  });

  it('marks started worlds as in progress with the pixel image', () => {
    const html = renderToStaticMarkup(<WorldsRow worlds={worlds} />);

    expect(html).toContain('data-state="active"');
    expect(html).toContain('En curso');
    expect(html).toContain('world-park-day.png');
    expect(html).toContain('data-state="new"');
    expect(html).toContain('Nuevo mundo');
  });

  it('shows the scene of a world not started under a gray veil', () => {
    const html = renderToStaticMarkup(<WorldsRow worlds={worlds} />);
    const newCard = html.slice(html.indexOf('data-state="new"'));

    expect(newCard).toContain('world-work-day.png');
    expect(newCard).toContain('world-arch__veil');
    expect(newCard).toContain('Nuevo mundo');
    expect(newCard).toContain('0/180');
    // Started worlds keep their full colour: no veil.
    const activeCard = html.slice(0, html.indexOf('data-state="new"'));
    expect(activeCard).not.toContain('world-arch__veil');
  });

  it('renders nothing without worlds', () => {
    expect(renderToStaticMarkup(<WorldsRow worlds={[]} />)).toBe('');
  });
});
