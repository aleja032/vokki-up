import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ProgressBar } from './progress-bar';

describe('ProgressBar', () => {
  it('exposes a labelled progressbar with value, min and max', () => {
    const html = renderToStaticMarkup(
      <ProgressBar label="Meta diaria" value={3} max={5} />
    );

    expect(html).toContain('role="progressbar"');
    expect(html).toContain('aria-label="Meta diaria"');
    expect(html).toContain('aria-valuenow="3"');
    expect(html).toContain('aria-valuemin="0"');
    expect(html).toContain('aria-valuemax="5"');
  });

  it('drives the continuous fill width through a --progress custom property', () => {
    const html = renderToStaticMarkup(
      <ProgressBar label="Meta" value={1} max={4} />
    );

    expect(html).toContain('--progress:25');
    expect(html).toContain('progress-bar__fill');
  });

  it('clamps out-of-range values', () => {
    const over = renderToStaticMarkup(
      <ProgressBar label="Meta" value={9} max={5} />
    );
    const under = renderToStaticMarkup(
      <ProgressBar label="Meta" value={-2} max={5} />
    );

    expect(over).toContain('aria-valuenow="5"');
    expect(over).toContain('--progress:100');
    expect(under).toContain('aria-valuenow="0"');
    expect(under).toContain('--progress:0');
  });

  it('applies the tone modifier and defaults to brand', () => {
    expect(
      renderToStaticMarkup(<ProgressBar label="x" tone="mint" value={1} />)
    ).toContain('progress-bar--mint');
    expect(
      renderToStaticMarkup(<ProgressBar label="x" tone="coral" value={1} />)
    ).toContain('progress-bar--coral');
    expect(renderToStaticMarkup(<ProgressBar label="x" value={1} />)).toContain(
      'progress-bar--brand'
    );
  });

  it('renders N segments and marks the filled ones when segmented', () => {
    const html = renderToStaticMarkup(
      <ProgressBar label="Racha" segments={5} value={2} max={5} />
    );

    expect(html.match(/progress-bar__segment/g)).toHaveLength(5);
    expect(html.match(/data-filled="true"/g)).toHaveLength(2);
    expect(html).toContain('progress-bar--segmented');
    expect(html).not.toContain('progress-bar__fill');
    expect(html).not.toContain('style=');
  });

  it('marks the current segment and the squared blocks shape', () => {
    const html = renderToStaticMarkup(
      <ProgressBar
        currentIndex={1}
        label="Ronda"
        max={4}
        segments={4}
        shape="blocks"
        value={2}
      />
    );

    expect(html.match(/data-current="true"/g)).toHaveLength(1);
    expect(html).toContain('progress-bar--blocks');
  });

  it('ignores shape and current segment when continuous', () => {
    const html = renderToStaticMarkup(
      <ProgressBar currentIndex={0} label="x" shape="blocks" value={1} />
    );

    expect(html).not.toContain('progress-bar--blocks');
    expect(html).not.toContain('data-current');
  });

  it('supports the neutral muted tone', () => {
    expect(
      renderToStaticMarkup(<ProgressBar label="x" tone="muted" value={1} />)
    ).toContain('progress-bar--muted');
  });
});
