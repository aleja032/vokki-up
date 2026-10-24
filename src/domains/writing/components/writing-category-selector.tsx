'use client';

import type { WritingCategory } from '../types';
import { WRITING_CATEGORIES } from '../data';
import { writingMessages } from '../messages';

type WritingCategorySelectorProps = {
  selected: WritingCategory;
  onSelect: (category: WritingCategory) => void;
};

export function WritingCategorySelector({
  selected,
  onSelect
}: WritingCategorySelectorProps) {
  return (
    <div
      className="essay-categories"
      role="group"
      aria-label={writingMessages.categories.groupLabel}
    >
      {WRITING_CATEGORIES.map(category => (
        <button
          className="essay-category"
          data-active={selected === category}
          key={category}
          onClick={() => onSelect(category)}
          type="button"
          aria-pressed={selected === category}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
