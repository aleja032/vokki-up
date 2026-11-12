'use client';

import { AiCaptureWorkflow } from '@/domains/ai/components/ai-capture-workflow';
import { useCardsLibraryState } from '@/domains/cards/hooks/use-cards-library-state';
import { useAiForCardsEnabled } from '@/lib/settings/use-ai-for-cards-enabled';
import { AiDisabledNotice } from '../ai-disabled-notice';
import { AiDesktopRedirect } from './ai-desktop-redirect';
import './ai-route.css';

/**
 * Full-page AI capture (mobile flow). Composes the ai workflow with the cards
 * library; on desktop the same flow lives inside the Cards add hub.
 */
export function AiCaptureContainer() {
  const library = useCardsLibraryState();
  const { isEnabled } = useAiForCardsEnabled();
  return (
    <div className="cards-ai-route">
      <AiDesktopRedirect />
      {isEnabled ? (
        <AiCaptureWorkflow library={library} />
      ) : (
        <AiDisabledNotice title />
      )}
    </div>
  );
}
