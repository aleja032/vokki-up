import { cn } from '@/lib/utils';
import { aiMessages } from '../messages';

type AiCaptureStepsProps = {
  active: 1 | 2 | 3;
  /** Step 2 is still running: its bar uses the lighter indigo. */
  isWorking?: boolean;
  /** Desktop review uses numbered section headings instead of the bar. */
  isMobileOnly?: boolean;
};

const STEP_LABELS = [
  aiMessages.steps.add,
  aiMessages.steps.review,
  aiMessages.steps.save
] as const;

export function AiCaptureSteps({
  active,
  isWorking = false,
  isMobileOnly = false
}: AiCaptureStepsProps) {
  return (
    <ol
      className={cn('aicap-steps', isMobileOnly && 'aicap-steps--mobile')}
      aria-label={aiMessages.frame.stepsLabel}
    >
      {STEP_LABELS.map((label, index) => {
        const stepNumber = index + 1;
        const isCurrent = stepNumber === active;
        const isDone = stepNumber < active;
        const tone =
          isDone || (isCurrent && stepNumber < 3)
            ? isCurrent && isWorking
              ? 'working'
              : 'done'
            : isCurrent
              ? 'saved'
              : 'todo';

        return (
          <li className="aicap-steps__item" key={label}>
            <span className="aicap-steps__bar" data-tone={tone} />
            <span
              className="aicap-steps__label"
              data-current={isCurrent}
              data-saved={isCurrent && stepNumber === 3}
            >
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
