import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { FormDialog } from './form-dialog';

function render(open: boolean) {
  return renderToStaticMarkup(
    <FormDialog open={open} title="Editar carpeta" onClose={() => undefined}>
      <input data-autofocus="" id="field" />
    </FormDialog>
  );
}

describe('FormDialog', () => {
  it('is a native dialog labelled by its title', () => {
    const html = render(true);
    const labelledBy = /aria-labelledby="([^"]+)"/.exec(html)?.[1];
    expect(html).toContain('<dialog');
    expect(html).toContain('role="dialog"');
    expect(html).not.toContain('alertdialog');
    expect(html).toContain(`id="${labelledBy}"`);
    expect(html).toContain('>Editar carpeta<');
  });

  it('renders its content only while open, so the form starts fresh each time', () => {
    expect(render(true)).toContain('id="field"');
    expect(render(false)).not.toContain('id="field"');
  });

  it('reuses the backdrop and panel styles of the overlay family', () => {
    const html = render(true);
    expect(html).toContain('class="form-dialog"');
    expect(html).toContain('form-dialog__panel');
  });
});
