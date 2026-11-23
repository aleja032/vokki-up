import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { PartOfSpeechIcon } from './part-of-speech-icon';

describe('PartOfSpeechIcon', () => {
  it('draws a different icon per known part of speech', () => {
    const noun = renderToStaticMarkup(
      <PartOfSpeechIcon partOfSpeech="Sustantivo" />
    );
    const verb = renderToStaticMarkup(
      <PartOfSpeechIcon partOfSpeech="Verbo" />
    );
    expect(noun).toContain('lucide-box');
    expect(verb).toContain('lucide-zap');
  });

  it('falls back to a tag for unknown or missing values', () => {
    expect(
      renderToStaticMarkup(<PartOfSpeechIcon partOfSpeech="Otra" />)
    ).toContain('lucide-tag');
    expect(
      renderToStaticMarkup(
        <PartOfSpeechIcon partOfSpeech={undefined as unknown as string} />
      )
    ).toContain('lucide-tag');
  });
});
