import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { SelectField } from './select-field';

const options = [
  { value: 'all', label: 'Todos' },
  { value: 'verb', label: 'Verbo' }
];

function render(value = 'all') {
  return renderToStaticMarkup(
    <SelectField
      id="type"
      label="Tipo"
      onChange={() => undefined}
      options={options}
      value={value}
    />
  );
}

describe('SelectField', () => {
  it('names the select with its visible caption', () => {
    const html = render();

    expect(html).toContain('for="type"');
    expect(html).toContain('id="type"');
    expect(html).toContain('>Tipo<');
  });

  it('renders every option and selects the active value', () => {
    const html = render('verb');

    expect(html).toContain('<option value="all">Todos</option>');
    expect(html).toMatch(/<option[^>]*value="verb"[^>]*selected[^>]*>Verbo/);
  });
});
