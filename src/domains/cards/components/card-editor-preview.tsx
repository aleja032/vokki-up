import { cardsMessages } from '../messages';

const messages = cardsMessages.cardEditor;

type CardEditorPreviewProps = {
  term: string;
  meaning: string;
  phonetics: string;
  example: string;
  partOfSpeech: string;
  tags: string[];
};

export function CardEditorPreview({
  term,
  meaning,
  phonetics,
  example,
  partOfSpeech,
  tags
}: CardEditorPreviewProps) {
  const trimmedTerm = term.trim();
  const trimmedMeaning = meaning.trim();
  const trimmedPhonetics = phonetics.trim();
  const trimmedExample = example.trim();

  return (
    <section
      className="deck-preview"
      aria-live="polite"
      aria-label={messages.previewLabel}
    >
      <h3 className="deck-preview__heading">{messages.previewHeading}</h3>
      <div className="deck-preview__card">
        <div className="deck-preview__top">
          <span className="deck-preview__label">{messages.previewLabel}</span>
          <span className="deck-preview__category" data-category={partOfSpeech}>
            {partOfSpeech}
          </span>
          <span className="deck-preview__tags">
            {tags.map(tag => `# ${tag}`).join('  ')}
          </span>
        </div>
        <div className="deck-preview__word">
          <span data-empty={!trimmedTerm}>
            {trimmedTerm || messages.previewTermFallback}
          </span>
          {trimmedPhonetics && <span>{phonetics}</span>}
        </div>
        <div className="deck-preview__body">
          <span data-empty={!trimmedMeaning}>
            {trimmedMeaning || messages.previewMeaningFallback}
          </span>
          {trimmedExample && (
            <span className="deck-preview__example">{example}</span>
          )}
        </div>
      </div>
    </section>
  );
}
