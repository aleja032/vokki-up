import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Chip } from './chip';

describe('Chip', () => {
  it('exposes the pressed state for filter chips', () => {
    const on = renderToStaticMarkup(
      <Chip onClick={() => undefined} pressed>
        Todas · 4
      </Chip>
    );
    const off = renderToStaticMarkup(
      <Chip onClick={() => undefined} pressed={false}>
        Verbo
      </Chip>
    );

    expect(on).toContain('aria-pressed="true"');
    expect(off).toContain('aria-pressed="false"');
    expect(on).toContain('Todas · 4');
  });

  it('omits aria-pressed for chips that navigate', () => {
    const html = renderToStaticMarkup(
      <Chip onClick={() => undefined}>Trabajo · 17</Chip>
    );

    expect(html).not.toContain('aria-pressed');
  });

  it('renders the add variant as an icon-only button with its own label', () => {
    const html = renderToStaticMarkup(
      <Chip
        aria-label="Nuevo grupo"
        icon={<svg />}
        onClick={() => undefined}
        variant="add"
      />
    );

    expect(html).toContain('chip--add');
    expect(html).toContain('aria-label="Nuevo grupo"');
    expect(html).not.toContain('chip__label');
  });

  it('renders tab semantics with aria-selected instead of aria-pressed', () => {
    const html = renderToStaticMarkup(
      <Chip
        onClick={() => undefined}
        tab={{ id: 'tab-profile', controls: 'panel-profile', selected: true }}
      >
        Perfil
      </Chip>
    );

    expect(html).toContain('role="tab"');
    expect(html).toContain('aria-selected="true"');
    expect(html).toContain('aria-controls="panel-profile"');
    expect(html).toContain('id="tab-profile"');
    expect(html).not.toContain('aria-pressed');
  });
});
