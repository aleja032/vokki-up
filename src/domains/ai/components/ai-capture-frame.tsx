import Link from 'next/link';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { aiMessages } from '../messages';
import { AiCaptureIcon } from './ai-capture-icon';
import { AiCaptureModeTabs } from './ai-capture-mode-tabs';
import './ai-capture.css';

const messages = aiMessages.frame;

type AiCaptureFrameProps = {
  mobileTitle: string;
  mobileSubtitle?: string;
  backHref: string;
  backLabel: string;
  connection?: 'online' | 'offline';
  /** Wide layout lets the review step use two columns on desktop. */
  layout?: 'narrow' | 'wide';
  /** Mobile top padding of the scrolling body. */
  spacing?: 'default' | 'roomy' | 'medium' | 'tight';
  children: ReactNode;
  footer?: ReactNode;
  /** Hides the mobile footer from desktop (the screen renders its own bar). */
  isFooterMobileOnly?: boolean;
  /** Shows the mode tabs inside the mobile body (only the add step does). */
  hasMobileTabs?: boolean;
  /** The created screen has no top bar in the proposal (heading stays for assistive tech). */
  isMobileBarSilent?: boolean;
};

export function AiCaptureFrame({
  mobileTitle,
  mobileSubtitle,
  backHref,
  backLabel,
  connection,
  layout = 'narrow',
  spacing = 'default',
  children,
  footer,
  isFooterMobileOnly = false,
  hasMobileTabs = false,
  isMobileBarSilent = false
}: AiCaptureFrameProps) {
  return (
    <div className="aicap" data-layout={layout}>
      <header
        className={cn('aicap__bar', isMobileBarSilent && 'aicap__bar--silent')}
      >
        <Link className="aicap__back" href={backHref} aria-label={backLabel}>
          <AiCaptureIcon name="back" />
        </Link>
        {mobileSubtitle ? (
          <div className="aicap__bar-heading">
            <h1 className="aicap__bar-title">{mobileTitle}</h1>
            <span className="aicap__bar-subtitle">{mobileSubtitle}</span>
          </div>
        ) : (
          <h1 className="aicap__bar-title">{mobileTitle}</h1>
        )}
        {connection === 'online' && (
          <span className="aicap-pill aicap-pill--online">
            <span className="aicap-pill__dot" />
            {messages.online}
          </span>
        )}
        {connection === 'offline' && (
          <span className="aicap-pill aicap-pill--offline">
            <span className="aicap-pill__dot" />
            {messages.offline}
          </span>
        )}
      </header>

      <div className="aicap__page-head">
        <div className="aicap__page-title">
          <Link className="aicap__crumb" href="/cards">
            <AiCaptureIcon name="back" size={16} />
            {messages.backToCards}
          </Link>
          <h1>{messages.desktopTitle}</h1>
        </div>
        <AiCaptureModeTabs />
      </div>

      <div className={cn('aicap__body', `aicap__body--${spacing}`)}>
        {hasMobileTabs && <AiCaptureModeTabs isMobileOnly />}
        {children}
      </div>

      {footer && (
        <footer
          className={cn(
            'aicap__footer',
            isFooterMobileOnly && 'aicap__footer--mobile-only'
          )}
        >
          {footer}
        </footer>
      )}
    </div>
  );
}
