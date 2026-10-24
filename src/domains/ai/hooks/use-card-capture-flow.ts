'use client';

import { useState } from 'react';
import { INITIAL_CARDS, INITIAL_GROUPS } from '@/domains/cards/data';
import { isCardList, isGroupList } from '@/domains/cards/library-validators';
import type { VocabularyCard } from '@/domains/cards/types';
import { mapCapturedCandidatesToCards } from '@/domains/cards/persistence/captured-cards';
import { collectionChangeBuilder } from '@/lib/sync/change-builders';
import { useTrackedBrowserState } from '@/lib/sync/use-tracked-browser-state';
import { requestCardCapture } from '../client';
import { deduplicateCaptureCandidates } from '../capture-candidates';
import type { CardCandidate, CaptureProposal } from '../types';

const cardChanges = collectionChangeBuilder<VocabularyCard>('card');

export function useCardCaptureFlow() {
  const [cards, setCards, areCardsLoaded] = useTrackedBrowserState(
    'cards/library',
    INITIAL_CARDS,
    isCardList,
    cardChanges
  );
  const [groups] = useTrackedBrowserState(
    'cards/groups',
    INITIAL_GROUPS,
    isGroupList,
    () => []
  );
  const [step, setStep] = useState<'add' | 'review' | 'created'>('add');
  const [text, setText] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState(
    INITIAL_GROUPS[0]?.id ?? ''
  );
  const [proposals, setProposals] = useState<CaptureProposal[]>([]);
  const [createdCards, setCreatedCards] = useState<VocabularyCard[]>([]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function generate() {
    setError('');
    if (!navigator.onLine) {
      setError(
        'Connect to the internet to generate proposals. Manual card creation remains available.'
      );
      return;
    }
    if (!text.trim() && !image) {
      setError(
        'Add vocabulary or choose an image before generating proposals.'
      );
      return;
    }
    if (image && image.size > 10 * 1024 * 1024) {
      setError(
        'The selected image is larger than 10 MB. Choose a smaller JPG or PNG.'
      );
      return;
    }
    if (image && !['image/jpeg', 'image/png'].includes(image.type)) {
      setError('This image format is not supported. Choose a JPG or PNG.');
      return;
    }

    setIsSubmitting(true);
    try {
      const sources: Array<{
        source: 'typed' | 'image';
        promise: Promise<{ candidates: CardCandidate[] }>;
      }> = [];
      if (text.trim()) {
        sources.push({
          source: 'typed',
          promise: requestCardCapture({ kind: 'text', text: text.trim() })
        });
      }
      if (image) {
        const base64 = await fileToBase64(image);
        sources.push({
          source: 'image',
          promise: requestCardCapture({
            kind: 'image',
            mimeType: image.type as 'image/jpeg' | 'image/png',
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
        groupId: selectedGroupId || groups[0]?.id || '',
        status: 'pending' as const
      }));
      if (!nextProposals.length) {
        setError(
          'No clear vocabulary was found. Try clearer text or a sharper image, or create a card manually.'
        );
        return;
      }
      setProposals(nextProposals);
      setStep('review');
    } catch (captureError) {
      setError(
        captureError instanceof Error
          ? captureError.message
          : 'The AI service could not generate proposals. Try again or create cards manually.'
      );
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

  function createCards() {
    setError('');
    if (!areCardsLoaded) {
      setError(
        'Your local card library is still loading. Try again in a moment.'
      );
      return;
    }
    if (!groups.some(group => group.id === selectedGroupId)) {
      setError('Choose an existing group before creating these cards.');
      return;
    }
    const accepted = proposals.filter(
      proposal => proposal.status === 'accepted'
    );
    if (!accepted.length) {
      setError('Accept at least one proposal before creating cards.');
      return;
    }
    const mapped = mapCapturedCandidatesToCards(accepted, selectedGroupId);
    if (mapped.some(card => !card.term || !card.meaning)) {
      setError(
        'One or more accepted proposals are incomplete. Edit them before saving.'
      );
      return;
    }
    setCards(current => [...mapped, ...current]);
    setCreatedCards(mapped);
    setStep('created');
  }

  function reset() {
    setText('');
    setImage(null);
    setProposals([]);
    setCreatedCards([]);
    setError('');
    setStep('add');
  }

  return {
    cards,
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
    error,
    isSubmitting,
    generate,
    updateProposal,
    setProposalStatus,
    acceptAll,
    rejectAll,
    createCards,
    reset
  };
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () =>
      reject(new Error('The image could not be read. Choose it again.'));
    reader.onload = () => {
      const dataUrl = reader.result;
      if (typeof dataUrl !== 'string') {
        reject(new Error('The image could not be read. Choose it again.'));
        return;
      }
      resolve(dataUrl.slice(dataUrl.indexOf(',') + 1));
    };
    reader.readAsDataURL(file);
  });
}
