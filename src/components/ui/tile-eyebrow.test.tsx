import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { TileEyebrow, TileEyebrowState } from './tile-eyebrow';

describe('TileEyebrow', () => {
  it('renders the category as a chip with a dot when there is no icon', () => {
    const html = renderToStaticMarkup(<TileEyebrow label="Noun" />);
    expect(html).toContain('tile-eyebrow__chip');
    expect(html).toContain('tile-eyebrow__dot');
    expect(html).toContain('title="Noun"');
  });

  it('uses the given icon instead of the dot and shows the trailing state', () => {
    const html = renderToStaticMarkup(
      <TileEyebrow
        icon={<svg data-icon />}
        label="Verb"
        trailing={<TileEyebrowState>Learning</TileEyebrowState>}
      />
    );
    expect(html).toContain('data-icon');
    expect(html).not.toContain('tile-eyebrow__dot');
    expect(html).toContain('tile-eyebrow__state');
    expect(html).toContain('Learning');
  });
});
