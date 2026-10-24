import { AiCaptureAdd } from './ai-capture-add';
import { AiCaptureCreated } from './ai-capture-created';
import { AiCaptureNoWords } from './ai-capture-no-words';
import { AiCaptureOffline } from './ai-capture-offline';
import { AiCaptureProcessing } from './ai-capture-processing';
import { AiCaptureReview } from './ai-capture-review';
import { AiCaptureServiceError } from './ai-capture-service-error';

export const AI_CAPTURE_STEPS = [
  'add',
  'processing',
  'review',
  'created'
] as const;
export type AiCaptureStep = (typeof AI_CAPTURE_STEPS)[number];

export const AI_CAPTURE_STATES = [
  'offline',
  'queued',
  'no-words',
  'service-error',
  'retrying',
  'discard-confirm',
  'discarded',
  'row-error',
  'empty',
  'ready'
] as const;
export type AiCaptureState = (typeof AI_CAPTURE_STATES)[number];

type AiCaptureScreenProps = {
  step: AiCaptureStep;
  state?: AiCaptureState;
};

/**
 * Static mockup switch. The error and edge states win over the step; the rest
 * only refine the matching step. Replace with real flow state when wiring.
 */
export function AiCaptureScreen({ step, state }: AiCaptureScreenProps) {
  if (state === 'offline' || state === 'queued') {
    return <AiCaptureOffline isQueued={state === 'queued'} />;
  }
  if (state === 'no-words') return <AiCaptureNoWords />;
  if (state === 'service-error' || state === 'retrying') {
    return <AiCaptureServiceError isRetrying={state === 'retrying'} />;
  }

  switch (step) {
    case 'processing':
      return <AiCaptureProcessing isReady={state === 'ready'} />;
    case 'review':
      return (
        <AiCaptureReview
          state={
            state === 'discard-confirm' || state === 'discarded'
              ? state
              : 'default'
          }
        />
      );
    case 'created':
      return <AiCaptureCreated />;
    default:
      return <AiCaptureAdd isEmpty={state === 'empty'} />;
  }
}
