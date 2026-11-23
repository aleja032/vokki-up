import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { LibraryViewTabs } from './library-view-tabs';

describe('LibraryViewTabs', () => {
  it('links both views and marks the current one', () => {
    const html = renderToStaticMarkup(<LibraryViewTabs view="library" />);

    expect(html).toContain('Por mundos');
    expect(html).toContain('Toda la biblioteca');
    expect(html).toContain('href="/cards/word-library"');
    expect(html).toContain('href="/cards/word-library?world=all"');
    expect(html.match(/aria-current="page"/g)).toHaveLength(1);
    expect(html).toMatch(/aria-current="page"[^>]*href="[^"]*world=all"/);
  });

  it('marks the worlds tab on the hub', () => {
    const html = renderToStaticMarkup(<LibraryViewTabs view="worlds" />);

    expect(html).toMatch(
      /aria-current="page"[^>]*href="\/cards\/word-library"/
    );
  });
});
