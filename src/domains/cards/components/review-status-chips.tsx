import { Target, Wifi, Zap } from 'lucide-react';
import { Pill } from '@/components/ui/pill';
import { cardsMessages } from '../messages';
import './review-status-chips.css';

const messages = cardsMessages.review;

// Combos shorter than this are not worth a badge.
const MIN_VISIBLE_COMBO = 2;

type ReviewStatusChipsProps = {
  combo: number;
  correct: number;
  reviewed: number;
};

// Live round status (proposal D): current combo, running accuracy and the
// offline notice. Combo and accuracy appear only once there is something real
// to show.
export function ReviewStatusChips({
  combo,
  correct,
  reviewed
}: ReviewStatusChipsProps) {
  return (
    <div className="review-status">
      {combo >= MIN_VISIBLE_COMBO ? (
        <Pill
          className="review-status__combo"
          icon={<Zap size={16} strokeWidth={2.2} />}
          tone="amber"
        >
          {messages.status.combo(combo)}
        </Pill>
      ) : null}
      {reviewed > 0 ? (
        <Pill
          className="review-status__chip"
          icon={<Target size={16} strokeWidth={2.2} />}
          tone="mint"
        >
          {messages.status.accuracy(correct, reviewed)}
        </Pill>
      ) : null}
      <Pill
        className="review-status__chip review-status__offline"
        icon={<Wifi size={16} strokeWidth={2.2} />}
      >
        {messages.offlineNotice}
      </Pill>
    </div>
  );
}
