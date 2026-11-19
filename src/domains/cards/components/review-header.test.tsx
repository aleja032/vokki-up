import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ReviewHeader } from './review-header';

function render(props: {
  position: number;
  total: number;
  reviewing: boolean;
}) {
  return renderToStaticMarkup(
    <ReviewHeader
      exitHref="/cards"
      isReviewing={props.reviewing}
      position={props.position}
      total={props.total}
    />
  );
}

describe('ReviewHeader', () => {
  it('links the exit pill to the review exit', () => {
    const html = render({ position: 1, total: 3, reviewing: true });
    expect(html).toContain('href="/cards"');
    expect(html).toContain('aria-label="Cerrar sesión de repaso"');
  });

  it('shows the position count and a segmented progress bar', () => {
    const html = render({ position: 5, total: 12, reviewing: true });
    expect(html).toContain('5 / 12');
    expect(html).toContain('role="progressbar"');
    expect(html).toContain('aria-valuenow="5"');
    expect(html).toContain('aria-valuemax="12"');
    expect(html.match(/progress-bar__segment/g)).toHaveLength(12);
    expect(html.match(/data-current="true"/g)).toHaveLength(1);
  });

  it('falls back to a continuous bar for long rounds', () => {
    const html = render({ position: 3, total: 40, reviewing: true });
    expect(html).not.toContain('progress-bar__segment');
    expect(html).toContain('progress-bar__fill');
  });

  it('highlights no segment once nothing is being reviewed', () => {
    const html = render({ position: 4, total: 4, reviewing: false });
    expect(html).not.toContain('data-current');
  });

  it('renders a full bar when there are no cards', () => {
    const html = render({ position: 0, total: 0, reviewing: false });
    expect(html).toContain('aria-valuenow="1"');
    expect(html).toContain('aria-valuemax="1"');
  });
});
