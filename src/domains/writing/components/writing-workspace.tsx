'use client';

import './writing.css';
import {
  WRITING_CATEGORIES,
  WRITING_DEFAULT_CATEGORY,
  WRITING_PROMPTS,
  WRITING_WORD_LIMIT
} from '../data';
import { writingMessages } from '../messages';
import type { WritingCategory } from '../types';
import { scalarChangeBuilder } from '@/lib/sync/change-builders';
import { useTrackedBrowserState } from '@/lib/sync/use-tracked-browser-state';
import { WritingCategorySelector } from './writing-category-selector';
import { WritingFeedbackPanel } from './writing-feedback-panel';
import { RefreshIcon } from './writing-icons';

const categoryChanges = scalarChangeBuilder<WritingCategory>(
  'writing-draft',
  'writing/category'
);
const draftChanges = scalarChangeBuilder<string>(
  'writing-draft',
  'writing/draft'
);
const copy = writingMessages;

export function WritingWorkspace() {
  const [category, setCategory] = useTrackedBrowserState<WritingCategory>(
    'writing/category',
    WRITING_DEFAULT_CATEGORY,
    isWritingCategory,
    categoryChanges
  );
  const [draft, setDraft] = useTrackedBrowserState(
    'writing/draft',
    '',
    isString,
    draftChanges
  );
  const wordCount = countWords(draft);

  return (
    <div className="essay-workspace">
      <header className="essay-heading">
        <div className="essay-heading__intro">
          <h1>{copy.heading.title}</h1>
          <p>{copy.heading.subtitle()}</p>
        </div>
      </header>

      <div className="essay-layout">
        <section
          className="essay-compose"
          aria-label={copy.editor.sectionLabel}
        >
          <WritingCategorySelector selected={category} onSelect={setCategory} />

          <article className="essay-prompt">
            <div className="essay-prompt__head">
              <span className="essay-prompt__label">
                {copy.prompt.labelPrefix} {category.toLocaleLowerCase()}
              </span>
              <button
                className="essay-prompt__change"
                type="button"
                onClick={() => setCategory(nextCategory(category))}
              >
                <RefreshIcon size={14} />
                {copy.prompt.changeTopic}
              </button>
            </div>
            <h2 className="essay-prompt__text">
              {WRITING_PROMPTS[category].title}{' '}
              <span className="essay-prompt__emphasis">
                {WRITING_PROMPTS[category].prompt}
              </span>
            </h2>
          </article>

          <div className="essay-editor-wrap">
            <label className="essay-editor-label" htmlFor="writing-draft">
              {copy.editor.label}
            </label>
            <textarea
              id="writing-draft"
              className="essay-editor"
              rows={7}
              value={draft}
              onChange={event => {
                setDraft(event.target.value);
              }}
              aria-describedby="writing-save-status"
            />
            <p className="essay-editor__status">
              <span
                className="essay-word-count"
                data-over-limit={wordCount > WRITING_WORD_LIMIT}
              >
                <strong>{wordCount}</strong> / {WRITING_WORD_LIMIT}{' '}
                {copy.editor.wordsSuffix}
              </span>{' '}
              <span className="essay-editor__saved" id="writing-save-status">
                {copy.editor.saved}
              </span>
            </p>
            <button
              className="essay-submit"
              type="button"
              disabled
              aria-describedby="writing-analysis-status"
            >
              {copy.editor.submit}
            </button>
          </div>
          <p
            className="essay-local-feedback"
            id="writing-analysis-status"
            role="status"
          >
            {copy.editor.localFeedback()}
          </p>
        </section>

        <aside
          className="essay-result"
          aria-label={copy.feedback.asideLabel()}
          aria-live="polite"
        >
          <WritingFeedbackPanel />
        </aside>
      </div>
    </div>
  );
}

function isWritingCategory(value: unknown): value is WritingCategory {
  return WRITING_CATEGORIES.includes(value as WritingCategory);
}
function isString(value: unknown): value is string {
  return typeof value === 'string';
}
function countWords(value: string) {
  return value.trim() ? value.trim().split(/\s+/).length : 0;
}
function nextCategory(category: WritingCategory): WritingCategory {
  return WRITING_CATEGORIES[
    (WRITING_CATEGORIES.indexOf(category) + 1) % WRITING_CATEGORIES.length
  ];
}
