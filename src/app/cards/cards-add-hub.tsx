'use client';

import { ArrowLeft } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { AiCaptureReviewPanel } from '@/domains/ai/components/ai-capture-review-panel';
import { AiCreatedPanel } from '@/domains/ai/components/ai-created-panel';
import { AiCaptureSteps } from '@/domains/ai/components/ai-capture-steps';
import { AiImagePane } from '@/domains/ai/components/ai-image-pane';
import { AiWordsPane } from '@/domains/ai/components/ai-words-pane';
import { aiMessages } from '@/domains/ai/messages';
import { useCardAutofill } from '@/domains/ai/hooks/use-card-autofill';
import {
  useCardCaptureFlow,
  type CaptureSourceKind
} from '@/domains/ai/hooks/use-card-capture-flow';
import { CardEditor } from '@/domains/cards/components/card-editor';
import type { CardsAddPanelApi } from '@/domains/cards/components/cards-add-panel.types';
import { createCapturedCardsLibrary } from '@/domains/cards/persistence/captured-cards';
import { addHubMessages } from './add-hub-messages';
import type { AddHubMode } from './add-hub-modes';
import {
  addHubPanelId,
  addHubTabId,
  AddHubModeTabs
} from './add-hub-mode-tabs';
import './cards-add-hub.css';

const messages = addHubMessages;

type CaptureSnapshot = {
  text: string;
  imageName: string;
  groupName: string;
};

type CardsAddHubProps = {
  panel: CardsAddPanelApi;
  initialMode: AddHubMode;
};

/**
 * Desktop "Agregar vocabulario" hub: image AI, word-list AI and manual entry
 * share one panel. The route layer composes the cards and ai domains here.
 */
export function CardsAddHub({ panel, initialMode }: CardsAddHubProps) {
  const [mode, setMode] = useState<AddHubMode>(initialMode);
  // UI-only: the review/created step is shown in the expanded hub.
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [isInitialOpen, setIsInitialOpen] = useState(initialMode !== 'manual');
  const [captureSnapshot, setCaptureSnapshot] = useState<CaptureSnapshot>();
  const generationId = useRef(0);
  const flow = useCardCaptureFlow(
    createCapturedCardsLibrary({
      groups: panel.groups,
      isReady: panel.isLibraryReady,
      addCards: panel.onAddCards
    })
  );
  const autofill = useCardAutofill();
  const view = isResultOpen && flow.step !== 'add' ? flow.step : 'modes';
  const isOpen = panel.isOpen || isResultOpen || isInitialOpen;
  const hubRef = useRef<HTMLElement>(null);
  const pendingReviewCount = flow.step === 'review' ? flow.proposals.length : 0;
  const activeStep = view === 'review' ? 2 : view === 'created' ? 3 : 1;

  // The expanded hub jumps to the top of the workspace: bring it into view.
  useEffect(() => {
    if (view === 'modes') return;
    const shouldReduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    hubRef.current?.scrollIntoView({
      block: 'start',
      behavior: shouldReduceMotion ? 'auto' : 'smooth'
    });
  }, [view]);

  function handleSelectMode(next: AddHubMode) {
    setMode(next);
    // A finished capture is over; a review in progress is kept and can be resumed.
    if (flow.step === 'created') flow.reset();
    setIsResultOpen(false);
  }

  async function handleGenerate(source: CaptureSourceKind) {
    const currentGenerationId = ++generationId.current;
    const snapshot: CaptureSnapshot = {
      text: source === 'text' ? flow.text.trim() : '',
      imageName: source === 'image' ? (flow.image?.name ?? '') : '',
      groupName:
        flow.groups.find(group => group.id === flow.selectedGroupId)?.name ?? ''
    };
    if (!(await flow.generate(source))) return;
    setCaptureSnapshot(snapshot);
    if (currentGenerationId === generationId.current) setIsResultOpen(true);
  }

  function closeAddView() {
    generationId.current += 1;
    setIsInitialOpen(false);
    setIsResultOpen(false);
  }

  function handleExit() {
    closeAddView();
    panel.onCancel();
  }

  function handleManualSave(card: Parameters<CardsAddPanelApi['onSave']>[0]) {
    closeAddView();
    panel.onSave(card);
  }

  function handleViewExisting(term: string) {
    closeAddView();
    panel.onViewExisting(term);
  }

  function handleCancelReview() {
    flow.backToAdd();
    setIsResultOpen(false);
  }

  function handleDone() {
    flow.reset();
    setIsResultOpen(false);
  }

  const paneProps = {
    groups: flow.groups,
    selectedGroupId: flow.selectedGroupId,
    onGroupChange: flow.setSelectedGroupId,
    error: flow.error,
    isSubmitting: flow.isSubmitting
  };

  return (
    <section
      ref={hubRef}
      className="addhub"
      data-view={view}
      data-open={isOpen}
      data-mode={mode}
      aria-labelledby="addhub-title"
    >
      <header className="addhub__header">
        <button
          className="addhub__exit"
          type="button"
          onClick={handleExit}
          aria-label={aiMessages.frame.backToCardsLabel}
        >
          <ArrowLeft size={18} aria-hidden="true" />
          {aiMessages.frame.backToCards}
        </button>
        <h2 id="addhub-title">{messages.title}</h2>
        <p>{messages.subtitle}</p>
      </header>
      <AddHubModeTabs mode={mode} onSelect={handleSelectMode} />
      {mode !== 'manual' && (
        <div className="addhub__progress">
          <AiCaptureSteps active={activeStep} />
        </div>
      )}

      {view === 'modes' && pendingReviewCount > 0 && (
        <div className="addhub__resume" role="status">
          <span>{messages.review.resume(pendingReviewCount)}</span>
          <button type="button" onClick={() => setIsResultOpen(true)}>
            {messages.review.resumeAction}
          </button>
        </div>
      )}

      <div className="addhub__stage">
        <div
          className="addhub__panel"
          role="tabpanel"
          id={addHubPanelId('image')}
          aria-labelledby={addHubTabId('image')}
          data-active={mode === 'image'}
          inert={mode !== 'image'}
        >
          <AiImagePane
            {...paneProps}
            image={flow.image}
            onImageChange={flow.setImage}
            onSubmit={() => void handleGenerate('image')}
          />
        </div>
        <div
          className="addhub__panel"
          role="tabpanel"
          id={addHubPanelId('words')}
          aria-labelledby={addHubTabId('words')}
          data-active={mode === 'words'}
          inert={mode !== 'words'}
        >
          <AiWordsPane
            {...paneProps}
            text={flow.text}
            onTextChange={flow.setText}
            onSubmit={() => void handleGenerate('text')}
          />
        </div>
        <div
          className="addhub__panel addhub__panel--manual"
          role="tabpanel"
          id={addHubPanelId('manual')}
          aria-labelledby={addHubTabId('manual')}
          data-active={mode === 'manual'}
          inert={mode !== 'manual'}
        >
          <CardEditor
            key={panel.editorKey}
            groups={panel.groups}
            existingTerms={panel.existingTerms}
            initialGroupId={panel.initialGroupId}
            isOpen={panel.isOpen || (isOpen && mode === 'manual')}
            isEmbedded
            onCancel={handleExit}
            onSave={handleManualSave}
            onCreateGroup={panel.onCreateGroup}
            onViewExisting={handleViewExisting}
            autofill={{
              status: autofill.status,
              errorMessage: autofill.errorMessage,
              onDismiss: autofill.dismiss,
              onRequest: async term => {
                const candidate = await autofill.suggest(term);
                return candidate
                  ? {
                      meaning: candidate.meaning,
                      phonetics: candidate.phonetics,
                      example: candidate.example,
                      partOfSpeech: candidate.partOfSpeech
                    }
                  : null;
              }
            }}
          />
        </div>
      </div>

      {view === 'review' && (
        <div className="addhub__result">
          <div className="addhub__result-head">
            <button
              className="addhub__back"
              type="button"
              aria-label={messages.review.backLabel}
              onClick={handleCancelReview}
            >
              <ArrowLeft size={18} aria-hidden="true" />
              {messages.review.back}
            </button>
            <div className="addhub__result-title">
              <h3>{messages.review.title}</h3>
              <p>{messages.review.subtitle}</p>
            </div>
          </div>
          <CaptureSummary snapshot={captureSnapshot} />
          <AiCaptureReviewPanel
            proposals={flow.proposals}
            partsOfSpeech={flow.partsOfSpeech}
            error={flow.error}
            cancel={
              <button
                className="aicap-button aicap-button--outline aicap-button--lg"
                type="button"
                onClick={handleCancelReview}
              >
                {messages.review.cancel}
              </button>
            }
            onAcceptAll={flow.acceptAll}
            onRejectAll={flow.rejectAll}
            onUpdate={flow.updateProposal}
            onStatus={flow.setProposalStatus}
            onCreate={flow.createCards}
          />
        </div>
      )}

      {view === 'created' && (
        <div className="addhub__result">
          <CaptureSummary
            snapshot={captureSnapshot}
            destinationGroupName={flow.createdGroupName}
          />
          <AiCreatedPanel
            cards={flow.createdCards}
            onDone={handleDone}
            onCreateMore={handleDone}
          />
        </div>
      )}
    </section>
  );
}

function CaptureSummary({
  snapshot,
  destinationGroupName
}: {
  snapshot?: CaptureSnapshot;
  destinationGroupName?: string;
}) {
  if (!snapshot) return null;
  const groupName = destinationGroupName ?? snapshot.groupName;

  return (
    <section
      className="addhub__capture-summary"
      aria-label={aiMessages.review.desktopInputTitle}
    >
      <dl className="addhub__capture-details">
        {snapshot.text && (
          <div className="addhub__capture-detail addhub__capture-detail--text">
            <dt>{aiMessages.review.desktopWords}</dt>
            <dd title={snapshot.text}>{snapshot.text}</dd>
          </div>
        )}
        {snapshot.imageName && (
          <div className="addhub__capture-detail">
            <dt>{aiMessages.review.desktopImage}</dt>
            <dd title={snapshot.imageName}>{snapshot.imageName}</dd>
          </div>
        )}
        {groupName && (
          <div className="addhub__capture-detail">
            <dt>{aiMessages.workflow.groupLabel}</dt>
            <dd title={groupName}>{groupName}</dd>
          </div>
        )}
      </dl>
    </section>
  );
}
