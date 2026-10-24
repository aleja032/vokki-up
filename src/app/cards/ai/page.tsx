import { AppShell } from '@/components/layout/app-shell';
import {
  AI_CAPTURE_STATES,
  AI_CAPTURE_STEPS,
  AiCaptureScreen,
  type AiCaptureState,
  type AiCaptureStep
} from '@/domains/ai/components/ai-capture-screen';

/*
 * STATIC MOCKUP of the AI card-capture flow: layout only, no real logic.
 * The screen is chosen by search params, for review purposes:
 *   ?step=add|processing|review|created                  (default: add)
 *   ?state=offline|queued|no-words|service-error|retrying
 *         |discard-confirm|discarded|row-error|empty|ready
 * Replace this switch (and the `capture-samples.ts` data) with the real flow
 * state when the capture feature is wired.
 */

type AiCapturePageProps = {
  searchParams: Promise<{ step?: string; state?: string }>;
};

function parseStep(value: string | undefined): AiCaptureStep {
  return AI_CAPTURE_STEPS.find(step => step === value) ?? 'add';
}

function parseState(value: string | undefined): AiCaptureState | undefined {
  return AI_CAPTURE_STATES.find(state => state === value);
}

export default async function AiCapturePage({
  searchParams
}: AiCapturePageProps) {
  const params = await searchParams;

  return (
    <AppShell>
      <AiCaptureScreen
        step={parseStep(params.step)}
        state={parseState(params.state)}
      />
    </AppShell>
  );
}
