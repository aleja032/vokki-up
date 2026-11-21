import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { LevelDiamonds } from './level-diamonds';

describe('LevelDiamonds', () => {
  it('fills the first N diamonds and names the row as one image', () => {
    const html = renderToStaticMarkup(
      <LevelDiamonds label="Nivel 2 de 3" level={2} />
    );

    expect(html).toContain('role="img"');
    expect(html).toContain('aria-label="Nivel 2 de 3"');
    expect(html.match(/data-filled="true"/g)).toHaveLength(2);
    expect(html.match(/data-filled="false"/g)).toHaveLength(1);
  });

  it('supports another maximum', () => {
    const html = renderToStaticMarkup(
      <LevelDiamonds label="x" level={0} max={5} />
    );

    expect(html.match(/level-diamonds__gem/g)).toHaveLength(5);
    expect(html).not.toContain('data-filled="true"');
  });
});
