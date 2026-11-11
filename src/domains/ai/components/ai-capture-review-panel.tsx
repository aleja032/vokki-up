'use client';

import { useState, type ReactNode } from 'react';
import { aiMessages } from '../messages';
import type { CardCandidate, CaptureProposal } from '../types';
import { AiCaptureProposalItem } from './ai-capture-proposal-item';
import './ai-capture.css';

const messages = aiMessages.proposals;

type AiCaptureReviewPanelProps = {
  proposals: CaptureProposal[];
  partsOfSpeech: readonly string[];
  error: string;
  /** Cancel control (a link on the full page, a button inside the hub). */
  cancel: ReactNode;
  onAcceptAll: () => void;
  onRejectAll: () => void;
  onUpdate: (id: string, update: Partial<CardCandidate>) => void;
  onStatus: (id: string, status: CaptureProposal['status']) => void;
  onCreate: () => void;
};

export function AiCaptureReviewPanel({
  proposals,
  partsOfSpeech,
  error,
  cancel,
  onAcceptAll,
  onRejectAll,
  onUpdate,
  onStatus,
  onCreate
}: AiCaptureReviewPanelProps) {
  // UI-only: which proposal is open for editing.
  const [editingId, setEditingId] = useState<string | null>(null);
  const accepted = proposals.filter(
    proposal => proposal.status === 'accepted'
  ).length;

  return (
    <div className="aicap-review" data-state="default">
      <section
        className="aicap-review__main"
        aria-labelledby="aicap-review-title"
      >
        <div className="aicap-review__head">
          <div className="aicap-review__heading">
            <h2 id="aicap-review-title">{messages.title}</h2>
            <span>{messages.counts(proposals.length, accepted)}</span>
          </div>
          <div className="aicap-bulk">
            <button
              className="aicap-bulk__accept"
              type="button"
              onClick={onAcceptAll}
            >
              {messages.acceptAll}
            </button>
            <button
              className="aicap-bulk__discard"
              type="button"
              onClick={onRejectAll}
            >
              {messages.discardAll}
            </button>
          </div>
        </div>
        {error && (
          <p className="aicap-alert" role="alert">
            {error}
          </p>
        )}
        <div className="aicap-proposals">
          {proposals.map(proposal => (
            <AiCaptureProposalItem
              key={proposal.id}
              proposal={proposal}
              editing={editingId === proposal.id}
              partsOfSpeech={partsOfSpeech}
              onEdit={() =>
                setEditingId(editingId === proposal.id ? null : proposal.id)
              }
              onUpdate={update => onUpdate(proposal.id, update)}
              onStatus={status => onStatus(proposal.id, status)}
            />
          ))}
        </div>
        <div className="aicap-savebar">
          <span className="aicap-savebar__hint">{messages.editHint}</span>
          <div className="aicap-savebar__actions">
            {cancel}
            <button
              className="aicap-button aicap-button--primary aicap-button--lg"
              type="button"
              onClick={onCreate}
              disabled={!accepted}
            >
              {messages.createCards(accepted)}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
