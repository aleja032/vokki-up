'use client';

import { useState } from 'react';
import { requestCardCapture } from '../client';
import { deduplicateCaptureCandidates } from '../capture-candidates';
import { countCaptureTerms, MAX_CAPTURE_TERMS } from '../capture-terms';
import { aiMessages } from '../messages';
import type {
  CapturedCardSummary,
  CaptureLibrary,
  CardCandidate,
  CaptureProposal
} from '../types';

const messages = aiMessages.flow;

export type CaptureSourceKind = 'text' | 'image';

/**
 * Drives the AI capture steps (add, review, created). The card library comes
 * from the route layer through `library`, so this hook stays inside the ai domain.
 * `generate('text' | 'image')` sends only that input; without it both are sent.
 */
export function useCardCaptureFlow(library: CaptureLibrary) {
  const { groups } = library;
  const [step, setStep] = useState<'add' | 'review' | 'created'>('add');
  const [text, setText] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [requestedGroupId, setSelectedGroupId] = useState('');
  const [proposals, setProposals] = useState<CaptureProposal[]>([]);
  const [createdCards, setCreatedCards] = useState<CapturedCardSummary[]>([]);
  const [createdGroupName, setCreatedGroupName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Groups load asynchronously: fall back to the first one until the user picks.
  const selectedGroupId = groups.some(group => group.id === requestedGroupId)
    ? requestedGroupId
    : (groups[0]?.id ?? '');

  /** Resolves true when proposals are ready to review. */
  async function generate(only?: CaptureSourceKind): Promise<boolean> {
    setError('');
    const sentText = only === 'image' ? '' : text.trim();
    const sentImage = only === 'text' ? null : image;
    if (!navigator.onLine) {
      setError(messages.offline);
      return false;
    }
    if (!sentText && !sentImage) {
      setError(messages.nothingToSend);
      return false;
    }
    if (countCaptureTerms(sentText) > MAX_CAPTURE_TERMS) {
      setError(messages.tooManyTerms(MAX_CAPTURE_TERMS));
      return false;
    }
    if (sentImage && sentImage.size > 10 * 1024 * 1024) {
      setError(messages.imageTooLarge);
      return false;
    }
    if (sentImage && !['image/jpeg', 'image/png'].includes(sentImage.type)) {
      setError(messages.imageFormat);
      return false;
    }

    setIsSubmitting(true);
    try {
      const sources: Array<{
        source: 'typed' | 'image';
        promise: Promise<{ candidates: CardCandidate[] }>;
      }> = [];
      if (sentText) {
        sources.push({
          source: 'typed',
          promise: requestCardCapture({ kind: 'text', text: sentText })
        });
      }
      if (sentImage) {
        const base64 = await fileToBase64(sentImage);
        sources.push({
          source: 'image',
          promise: requestCardCapture({
            kind: 'image',
            mimeType: sentImage.type as 'image/jpeg' | 'image/png',
            base64
          })
        });
      }
      const results = await Promise.all(
        sources.map(async entry => ({
          source: entry.source,
          result: await entry.promise
        }))
      );
      const uniqueCandidates = deduplicateCaptureCandidates(
        results.flatMap(({ source, result }) =>
          result.candidates.map(candidate => ({ source, candidate }))
        )
      );
      const nextProposals = uniqueCandidates.map(({ source, candidate }) => ({
        ...candidate,
        id: crypto.randomUUID(),
        source,
        original: candidate.original ?? '',
        groupId: selectedGroupId,
        status: 'pending' as const
      }));
      if (!nextProposals.length) {
        setError(messages.noVocabulary);
        return false;
      }
      setProposals(nextProposals);
      setStep('review');
      return true;
    } catch (captureError) {
      setError(
        captureError instanceof Error ? captureError.message : messages.failed
      );
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  function updateProposal(id: string, update: Partial<CardCandidate>) {
    setProposals(current =>
      current.map(proposal =>
        proposal.id === id ? { ...proposal, ...update } : proposal
      )
    );
  }

  function setProposalStatus(id: string, status: CaptureProposal['status']) {
    setProposals(current =>
      current.map(proposal =>
        proposal.id === id ? { ...proposal, status } : proposal
      )
    );
  }

  function acceptAll() {
    setProposals(current =>
      current.map(proposal => ({ ...proposal, status: 'accepted' }))
    );
  }

  function rejectAll() {
    setProposals(current =>
      current.map(proposal => ({ ...proposal, status: 'rejected' }))
    );
  }

  /** Resolves true when the accepted proposals were saved as cards. */
  function createCards(): boolean {
    setError('');
    if (!library.isReady) {
      setError(messages.libraryLoading);
      return false;
    }
    if (!groups.some(group => group.id === selectedGroupId)) {
      setError(messages.chooseGroup);
      return false;
    }
    const accepted = proposals.filter(
      proposal => proposal.status === 'accepted'
    );
    if (!accepted.length) {
      setError(messages.acceptOne);
      return false;
    }
    if (
      accepted.some(
        proposal => !proposal.word.trim() || !proposal.meaning.trim()
      )
    ) {
      setError(messages.incomplete);
      return false;
    }
    const destinationGroup = groups.find(group => group.id === selectedGroupId);
    setCreatedCards(library.saveAccepted(accepted, selectedGroupId));
    setCreatedGroupName(destinationGroup?.name ?? '');
    setStep('created');
    return true;
  }

  /** Leaves the review step; typed text and the chosen image are kept. */
  function backToAdd() {
    setProposals([]);
    setError('');
    setStep('add');
  }

  function reset() {
    setText('');
    setImage(null);
    setProposals([]);
    setCreatedCards([]);
    setCreatedGroupName('');
    setError('');
    setStep('add');
  }

  return {
    groups,
    step,
    text,
    setText,
    image,
    setImage,
    selectedGroupId,
    setSelectedGroupId,
    proposals,
    createdCards,
    createdGroupName,
    partsOfSpeech: library.partsOfSpeech,
    error,
    isSubmitting,
    generate,
    updateProposal,
    setProposalStatus,
    acceptAll,
    rejectAll,
    createCards,
    backToAdd,
    reset
  };
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error(messages.imageUnreadable));
    reader.onload = () => {
      const dataUrl = reader.result;
      if (typeof dataUrl !== 'string') {
        reject(new Error(messages.imageUnreadable));
        return;
      }
      resolve(dataUrl.slice(dataUrl.indexOf(',') + 1));
    };
    reader.readAsDataURL(file);
  });
}
