import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { SelectionActionBar } from './selection-action-bar';

function render(overrides: Partial<Parameters<typeof SelectionActionBar>[0]>) {
  return renderToStaticMarkup(
    <SelectionActionBar
      label="Agregar palabras"
      summary="2 palabras seleccionadas"
      toggleAllLabel="Seleccionar todas"
      cancelLabel="Cancelar"
      primaryLabel="Agregar 2"
      primaryDisabled={false}
      onToggleAll={() => undefined}
      onCancel={() => undefined}
      onPrimary={() => undefined}
      {...overrides}
    />
  );
}

describe('SelectionActionBar', () => {
  it('renders the summary, both toggles and the primary action in a dock', () => {
    const html = render({});

    expect(html).toContain('selection-dock');
    expect(html).toContain('role="group"');
    expect(html).toContain('aria-label="Agregar palabras"');
    expect(html).toContain('2 palabras seleccionadas');
    expect(html).toContain('Seleccionar todas');
    expect(html).toContain('Cancelar');
    expect(html).toContain('Agregar 2');
  });

  it('disables the primary action when nothing is selected', () => {
    expect(render({ primaryDisabled: true })).toMatch(
      /<button[^>]*disabled=""[^>]*>[^]*Agregar 2/
    );
  });

  it('disables select all when there is nothing to select', () => {
    expect(render({ toggleAllDisabled: true })).toMatch(
      /<button[^>]*disabled=""[^>]*>Seleccionar todas/
    );
  });

  it('marks a danger primary action', () => {
    expect(render({ primaryTone: 'danger' })).toContain(
      'selection-bar__primary--danger'
    );
  });
});
