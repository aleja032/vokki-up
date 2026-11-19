import { PixelLabel } from '@/components/ui/pixel-label';
import { ProgressBar } from '@/components/ui/progress-bar';
import { cardsMessages } from '../messages';
import {
  MAX_CARD_MEMORY,
  type CardMemory,
  type CardMemoryTone
} from '../card-memory';
import './review-memory-footer.css';

const messages = cardsMessages.review.memory;

// Read at render time: the message proxy resolves the active language lazily.
function memoryLabel(tone: CardMemoryTone): string {
  if (tone === 'brand') return messages.new;
  if (tone === 'coral') return messages.low;
  return tone === 'amber' ? messages.medium : messages.high;
}

// Memory strength of the card on screen: the real repetition count of its
// schedule (see card-memory.ts), worded from weak to strong.
export function ReviewMemoryFooter({ memory }: { memory: CardMemory }) {
  return (
    <div className="review-memory" data-tone={memory.tone}>
      <PixelLabel className="review-memory__label">
        {memoryLabel(memory.tone)}
      </PixelLabel>
      <ProgressBar
        className="review-memory__bar"
        label={cardsMessages.overview.memoryLabel(memory.level)}
        max={MAX_CARD_MEMORY}
        segments={MAX_CARD_MEMORY}
        shape="blocks"
        tone={memory.tone}
        value={memory.level}
      />
    </div>
  );
}
