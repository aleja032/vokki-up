import { AiBoundaryError } from './types';

type OpenAiConnectionTestOptions = {
  apiKey: string;
  model: string;
  fetchImplementation?: typeof fetch;
};

export async function testOpenAiConnection({
  apiKey,
  model,
  fetchImplementation = fetch
}: OpenAiConnectionTestOptions): Promise<void> {
  let response: Response;
  try {
    response = await fetchImplementation(
      `https://api.openai.com/v1/models/${encodeURIComponent(model)}`,
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${apiKey}` },
        cache: 'no-store',
        signal: AbortSignal.timeout(10_000)
      }
    );
  } catch (error) {
    if (error instanceof DOMException && error.name === 'TimeoutError') {
      throw new AiBoundaryError(
        'CAPABILITY_UNAVAILABLE',
        'OpenAI did not respond in time. Check your connection and try again.',
        504
      );
    }
    throw new AiBoundaryError(
      'CAPABILITY_UNAVAILABLE',
      'OpenAI could not be reached. Check your connection and try again.',
      502
    );
  }

  if (!response.ok) {
    const message =
      response.status === 401 || response.status === 403
        ? 'OpenAI rejected the API key. Check that it is valid and has access to the selected model.'
        : response.status === 429
          ? 'OpenAI rate limit or quota reached. Check the project quota and try again later.'
          : `OpenAI could not verify this connection (HTTP ${response.status}). Check the selected model and try again.`;
    throw new AiBoundaryError(
      'CAPABILITY_UNAVAILABLE',
      message,
      response.status === 429 ? 429 : 502
    );
  }
}
