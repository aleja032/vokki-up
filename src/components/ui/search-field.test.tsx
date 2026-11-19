import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { SearchField } from './search-field';

describe('SearchField', () => {
  it('labels the search input and shows its value and placeholder', () => {
    const html = renderToStaticMarkup(
      <SearchField
        id="search"
        label="Buscar cartas"
        onChange={() => undefined}
        placeholder="Buscar palabra"
        value="deadline"
      />
    );

    expect(html).toContain('for="search"');
    expect(html).toContain('Buscar cartas');
    expect(html).toContain('type="search"');
    expect(html).toContain('placeholder="Buscar palabra"');
    expect(html).toContain('value="deadline"');
  });
});
