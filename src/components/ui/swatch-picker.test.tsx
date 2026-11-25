import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { SwatchPicker, type SwatchOption } from './swatch-picker';

const options: SwatchOption[] = [
  { value: 'indigo', label: 'Índigo', color: 'indigo' },
  { value: 'teal', label: 'Turquesa', color: 'teal' },
  { value: 'gray', label: 'Gris', color: 'gray' }
];

function render(props: { value?: string; autoFocusSelected?: boolean } = {}) {
  return renderToStaticMarkup(
    <SwatchPicker
      legend="Color de la carpeta"
      name="folder-color"
      onChange={() => undefined}
      options={options}
      value={props.value ?? 'teal'}
      autoFocusSelected={props.autoFocusSelected}
    />
  );
}

describe('SwatchPicker', () => {
  it('is a radio group named by its legend, one radio per option', () => {
    const html = render();
    expect(html).toContain('<fieldset');
    expect(html).toContain('>Color de la carpeta<');
    expect(html.match(/type="radio"/g)).toHaveLength(3);
    expect(html.match(/name="folder-color"/g)).toHaveLength(3);
  });

  it('names every swatch with its color name', () => {
    const html = render();
    for (const label of ['Índigo', 'Turquesa', 'Gris'])
      expect(html).toContain(`>${label}<`);
  });

  it('checks only the selected color and exposes it to the styles', () => {
    const html = render({ value: 'gray' });
    expect(html.match(/checked=""/g)).toHaveLength(1);
    expect(html).toMatch(
      /value="gray"[^>]*checked=""|checked=""[^>]*value="gray"/
    );
    expect(html).toContain('data-folder-color="teal"');
  });

  it('marks the selected radio as the one to focus when asked', () => {
    expect(render()).not.toContain('data-autofocus');
    const html = render({ autoFocusSelected: true });
    expect(html.match(/data-autofocus/g)).toHaveLength(1);
    expect(html).toMatch(
      /value="teal"[^>]*data-autofocus|data-autofocus[^>]*value="teal"/
    );
  });
});
