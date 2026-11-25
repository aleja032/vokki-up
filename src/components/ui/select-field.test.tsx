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

describe('SelectField icon face', () => {
  it('adds a face with the icon and the current option only when given an icon', () => {
    const withIcon = renderToStaticMarkup(
      <SelectField
        icon={<svg data-testid="face" />}
        id="type"
        label="Tipo"
        onChange={() => undefined}
        options={options}
        value="verb"
      />
    );
    expect(withIcon).toContain('select-field__face');
    expect(withIcon).toMatch(/select-field__current[^>]*>Verbo</);
    expect(render()).not.toContain('select-field__face');
  });
});

describe('SelectField active state', () => {
  it('marks the field when a non-default option is chosen', () => {
    const html = renderToStaticMarkup(
      <SelectField
        id="type"
        isActive
        label="Tipo"
        onChange={() => undefined}
        options={options}
        value="verb"
      />
    );
    expect(html).toContain('data-active="true"');
    expect(render()).not.toContain('data-active');
  });
});

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
