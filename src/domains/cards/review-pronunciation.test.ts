import { describe, expect, it } from 'vitest';
import {
  initialSpeechAttemptState,
  speechAttemptReducer
} from './components/review-card-screen';

describe('review pronunciation attempts', () => {
  it('clears an earlier error and ignores its late failure callback', () => {
    const firstAttemptFailed = speechAttemptReducer(initialSpeechAttemptState, {
      type: 'started',
      attemptId: 1
    });
    const withFailure = speechAttemptReducer(firstAttemptFailed, {
      type: 'failed',
      attemptId: 1
    });

    const secondAttemptStarted = speechAttemptReducer(withFailure, {
      type: 'started',
      attemptId: 2
    });
    const afterStaleFailure = speechAttemptReducer(secondAttemptStarted, {
      type: 'failed',
      attemptId: 1
    });

    expect(secondAttemptStarted).toEqual({
      activeAttemptId: 2,
      failedAttemptId: null
    });
    expect(afterStaleFailure).toBe(secondAttemptStarted);
    expect(
      speechAttemptReducer(afterStaleFailure, {
        type: 'failed',
        attemptId: 2
      })
    ).toEqual({ activeAttemptId: 2, failedAttemptId: 2 });
  });
});
