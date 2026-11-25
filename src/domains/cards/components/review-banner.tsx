import Image from 'next/image';
import { Play } from 'lucide-react';
import { ActionPill } from '@/components/ui/action-pill';
import { PixelLabel } from '@/components/ui/pixel-label';
import { cardsMessages } from '../messages';
import { estimateReviewMinutes } from '../review-estimate';
import './review-banner.css';

const messages = cardsMessages.overview;

type ReviewBannerProps = {
  /** Cards in the round (already capped), also the number on the button. */
  count: number;
  /** The selected folder: the banner then names it and reviews only it. */
  folder?: { id: string; name: string };
};

// Phones: the review as a small hero card (the dark game surface of the home
// hero, in both themes) with Noma peeking over its corner. It is the only
// page-level review action on phones and follows the selected folder; wide
// screens keep the header button instead.
export function ReviewBanner({ count, folder }: ReviewBannerProps) {
  return (
    <section aria-label={messages.reviewBannerLabel} className="review-banner">
      <div aria-hidden="true" className="review-banner__backdrop">
        <span className="review-banner__glow" />
      </div>
      <Image
        alt=""
        aria-hidden="true"
        className="review-banner__mascot motion-mascot-bob"
        height={587}
        src="/images/noma-cheer.png"
        width={700}
      />
      <div className="review-banner__copy">
        <PixelLabel className="review-banner__kicker">
          {folder ? folder.name : messages.reviewBannerKicker}
        </PixelLabel>
        <p className="review-banner__title">
          {messages.reviewBannerTitle(count)}
        </p>
        <p className="review-banner__lead">
          {messages.reviewBannerLead(count, estimateReviewMinutes(count))}
        </p>
      </div>
      <ActionPill
        aria-label={
          folder ? messages.reviewFolderLabel(count, folder.name) : undefined
        }
        className="review-banner__cta"
        href={
          folder
            ? `/review?groupId=${encodeURIComponent(folder.id)}&from=cards`
            : '/review?from=cards'
        }
        icon={<Play fill="currentColor" size={18} strokeWidth={2.4} />}
        pulse={count > 0}
        variant="primary"
      >
        {messages.reviewShort(count)}
      </ActionPill>
    </section>
  );
}
