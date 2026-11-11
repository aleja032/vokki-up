import Link from 'next/link';
import { cn } from '@/lib/utils';
import { aiMessages } from '../messages';

const messages = aiMessages.frame;

type AiCaptureModeTabsProps = {
  /** Mobile renders the tabs in the body; desktop renders them in the page head. */
  isMobileOnly?: boolean;
};

export function AiCaptureModeTabs({
  isMobileOnly = false
}: AiCaptureModeTabsProps) {
  return (
    <div
      className={cn('aicap-modes', isMobileOnly && 'aicap-modes--mobile')}
      role="tablist"
      aria-label={messages.modesLabel}
    >
      <Link
        className="aicap-modes__tab"
        href="/cards/ai"
        role="tab"
        aria-selected="true"
      >
        <span className="aicap-modes__badge">{messages.modeAiBadge}</span>
        {messages.modeAi}
      </Link>
      <Link
        className="aicap-modes__tab"
        href="/cards"
        role="tab"
        aria-selected="false"
      >
        {messages.modeManual}
      </Link>
    </div>
  );
}
