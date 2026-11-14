import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ConfirmDialog } from './confirm-dialog';

function render(open: boolean) {
  return renderToStaticMarkup(
    <ConfirmDialog
      open={open}
      title="¿Eliminar esta tarjeta?"
      description="No se puede deshacer."
      confirmLabel="Eliminar"
      cancelLabel="Cancelar"
      onConfirm={() => undefined}
      onCancel={() => undefined}
    />
  );
}

describe('ConfirmDialog', () => {
  it('renders an alertdialog labelled by its title and description', () => {
    const html = render(true);
    const labelledBy = /aria-labelledby="([^"]+)"/.exec(html)?.[1];
    const describedBy = /aria-describedby="([^"]+)"/.exec(html)?.[1];

    expect(html).toContain('<dialog');
    expect(html).toContain('role="alertdialog"');
    expect(html).toContain(`id="${labelledBy}"`);
    expect(html).toContain(`id="${describedBy}"`);
  });

  it('shows the caller labels and a danger tone', () => {
    const html = render(true);

    expect(html).toContain('¿Eliminar esta tarjeta?');
    expect(html).toContain('No se puede deshacer.');
    expect(html).toContain('>Cancelar</button>');
    expect(html).toContain('>Eliminar</button>');
    expect(html).toContain('data-tone="danger"');
  });

  it('never marks the dialog open on the server; showModal owns that', () => {
    expect(render(true)).not.toMatch(/<dialog[^>]*\sopen/);
  });
});
