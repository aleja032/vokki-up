import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import {
  countEntriesByLevel,
  normalizeCatalogTerm,
  wordLibraryCatalog
} from '../word-library/catalog';
import { summarizeWorlds } from '../word-library/worlds';
import { WorldBanner } from './world-banner';
import { WorldStages } from './world-stages';
import { WorldsHub } from './worlds-hub';

const levelTotals = countEntriesByLevel(wordLibraryCatalog);

function owned(count: number) {
  return new Set(
    wordLibraryCatalog
      .filter(entry => entry.category === 'Día a día')
      .slice(0, count)
      .map(entry => normalizeCatalogTerm(entry.term))
  );
}

describe('WorldsHub', () => {
  it('lists the four worlds as links to the filtered library', () => {
    const html = renderToStaticMarkup(
      <WorldsHub
        levelTotals={levelTotals}
        worlds={summarizeWorlds(wordLibraryCatalog, owned(5))}
      />
    );

    for (const id of ['daily', 'work', 'travel', 'phrases'])
      expect(html).toContain(`href="/cards/word-library?world=${id}"`);
    expect(html).toContain('href="/cards/word-library?world=all"');
    expect(html).toContain('Mundos');
    expect(html).toContain('4 mundos');
    expect(html).toContain('5 en tu mazo');
  });

  it('marks only worlds with words in the deck as in progress', () => {
    const html = renderToStaticMarkup(
      <WorldsHub
        levelTotals={levelTotals}
        worlds={summarizeWorlds(wordLibraryCatalog, owned(5))}
      />
    );

    expect(html.match(/data-state="active"/g)).toHaveLength(1);
    expect(html.match(/data-state="idle"/g)).toHaveLength(3);
  });

  it('shows the real catalog count per level, with diamonds', () => {
    const html = renderToStaticMarkup(
      <WorldsHub
        levelTotals={levelTotals}
        worlds={summarizeWorlds(wordLibraryCatalog, new Set())}
      />
    );

    expect(html).toContain(`${levelTotals.basic} palabras`);
    expect(html).toContain('Nivel 3 de 3');
  });
});

describe('WorldsHub information architecture', () => {
  it('explains worlds, offers the two tabs and no whole-library button', () => {
    const html = renderToStaticMarkup(
      <WorldsHub
        levelTotals={levelTotals}
        worlds={summarizeWorlds(wordLibraryCatalog, new Set())}
      />
    );

    expect(html).toContain('Elige un mundo para aprender por tema');
    expect(html).toContain('Por mundos');
    expect(html).toContain('Toda la biblioteca');
    expect(html).not.toContain('Abrir toda la biblioteca');
    expect(html).not.toContain('Continuar');
  });

  it('continues the world already in progress', () => {
    const html = renderToStaticMarkup(
      <WorldsHub
        levelTotals={levelTotals}
        worlds={summarizeWorlds(wordLibraryCatalog, owned(5))}
      />
    );

    expect(html).toContain('Continuar Día a día');
  });

  it('shows art for every world, active or not, with a facts line', () => {
    const html = renderToStaticMarkup(
      <WorldsHub
        levelTotals={levelTotals}
        worlds={summarizeWorlds(wordLibraryCatalog, owned(5))}
      />
    );

    expect(html).toContain('world-cafe-words.png');
    expect(html).toContain('world-work.svg');
    expect(html).toContain('world-travel.svg');
    expect(html).toContain('world-phrases.svg');
    expect(html).toContain('/images/noma.png');
    expect(html).toContain('200 palabras · 5 en tu mazo');
  });
});

describe('WorldBanner and WorldStages', () => {
  const [daily] = summarizeWorlds(wordLibraryCatalog, owned(4));

  it('shows the world name, a link back to the hub and its counts', () => {
    const html = renderToStaticMarkup(<WorldBanner world={daily} />);

    expect(html).toContain('href="/cards/word-library"');
    expect(html).toContain('Día a día');
    expect(html).toContain(`${daily.total} palabras · 4 en tu mazo`);
    expect(html).toContain('world-cafe-words.png');
    expect(html).not.toContain('motion-float-tag');
  });

  it('floats real words over the art of worlds without words in it', () => {
    const work = summarizeWorlds(wordLibraryCatalog, new Set())[1];
    const html = renderToStaticMarkup(<WorldBanner world={work} />);

    expect(html).toContain('world-work.svg');
    expect(html.match(/motion-float-tag/g)).toHaveLength(3);
  });

  it('shows one stage per level and highlights the filtered one', () => {
    const html = renderToStaticMarkup(
      <WorldStages activeLevel="intermediate" world={daily} />
    );

    expect(html.match(/world-stages__stage/g)).toHaveLength(3);
    expect(html.match(/data-active="true"/g)).toHaveLength(1);
    expect(html).toContain(
      `Intermedio · ${daily.levels.intermediate.inDeck} de ${daily.levels.intermediate.total} en tu mazo`
    );
  });
});
