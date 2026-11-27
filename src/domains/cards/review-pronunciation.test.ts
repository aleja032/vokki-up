import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  getReplayExample,
  initialSpeechAttemptState,
  speakPronunciation,
  speechAttemptReducer
} from './components/review-card-screen';

class MockUtterance {
  lang = '';
  onerror: ((event: { error: string }) => void) | null = null;
  onend: (() => void) | null = null;

  constructor(readonly text: string) {}
}

function setupSpeechSynthesis() {
  const speak = vi.fn();
  const cancel = vi.fn();
  vi.stubGlobal('window', { speechSynthesis: { speak, cancel } });
  vi.stubGlobal('SpeechSynthesisUtterance', MockUtterance);
  return { speak, cancel };
}

afterEach(() => vi.unstubAllGlobals());

describe('replay example', () => {
  it('reads only the word while the meaning is hidden', () => {
    expect(getReplayExample(false, 'She is reliable.')).toBeUndefined();
  });

  it('reads the example after the word once the meaning is revealed', () => {
    expect(getReplayExample(true, 'She is reliable.')).toBe('She is reliable.');
    expect(getReplayExample(true, undefined)).toBeUndefined();
  });
});

describe('review pronunciation speech', () => {
  it('speaks the example only after the term finishes', () => {
    const { speak } = setupSpeechSynthesis();

    speakPronunciation(
      'serendipity',
      'en-US',
      'A fortunate accident.',
      vi.fn()
    );

    expect(speak).toHaveBeenCalledTimes(1);
    const termUtterance = speak.mock.calls[0][0] as MockUtterance;
    expect(termUtterance.text).toBe('serendipity');
    expect(termUtterance.lang).toBe('en-US');

    termUtterance.onend?.();

    expect(speak).toHaveBeenCalledTimes(2);
    expect((speak.mock.calls[1][0] as MockUtterance).text).toBe(
      'A fortunate accident.'
    );
  });

  it('does not continue to the example after its attempt becomes obsolete', () => {
    const { speak } = setupSpeechSynthesis();
    let isAttemptCurrent = true;

    speakPronunciation(
      'serendipity',
      'en-US',
      'A fortunate accident.',
      vi.fn(),
      () => isAttemptCurrent
    );

    isAttemptCurrent = false;
    (speak.mock.calls[0][0] as MockUtterance).onend?.();

    expect(speak).toHaveBeenCalledOnce();
  });

  it('speaks only the term when no example is present', () => {
    const { speak } = setupSpeechSynthesis();

    speakPronunciation('serendipity', 'en-US', undefined, vi.fn());

    expect(speak).toHaveBeenCalledTimes(1);
    expect((speak.mock.calls[0][0] as MockUtterance).text).toBe('serendipity');
  });

  it('can speak the example alone after the meaning is revealed', () => {
    const { speak } = setupSpeechSynthesis();

    speakPronunciation('A fortunate accident.', 'en-US', undefined, vi.fn());

    expect(speak).toHaveBeenCalledOnce();
    expect((speak.mock.calls[0][0] as MockUtterance).text).toBe(
      'A fortunate accident.'
    );
  });

  it('treats an autoplay block as "blocked", not as a failure, so it can retry on a tap', () => {
    const { speak } = setupSpeechSynthesis();
    const onFailure = vi.fn();
    const onBlocked = vi.fn();

    speakPronunciation(
      'serendipity',
      'en-US',
      undefined,
      onFailure,
      () => true,
      onBlocked
    );
    (speak.mock.calls[0][0] as MockUtterance).onerror?.({
      error: 'not-allowed'
    });

    expect(onBlocked).toHaveBeenCalledOnce();
    expect(onFailure).not.toHaveBeenCalled();
  });

  it('still reports a not-allowed error as a failure when nobody listens for blocks', () => {
    const { speak } = setupSpeechSynthesis();
    const onFailure = vi.fn();

    speakPronunciation('serendipity', 'en-US', undefined, onFailure);
    (speak.mock.calls[0][0] as MockUtterance).onerror?.({
      error: 'not-allowed'
    });

    expect(onFailure).toHaveBeenCalledOnce();
  });

  it('reports an example speech error through the current attempt callback', () => {
    const { speak } = setupSpeechSynthesis();
    const onFailure = vi.fn();

    speakPronunciation(
      'serendipity',
      'en-US',
      'A fortunate accident.',
      onFailure
    );
    (speak.mock.calls[0][0] as MockUtterance).onend?.();
    (speak.mock.calls[1][0] as MockUtterance).onerror?.({ error: 'network' });

    expect(onFailure).toHaveBeenCalledOnce();
  });
});

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
