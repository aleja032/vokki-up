import { getAiCapabilityProvider } from '@/domains/ai/server';
import { AiBoundaryError, type AiErrorResponse } from '@/domains/ai/types';
import { validateWritingFeedbackRequest } from '@/domains/ai/validation';

export async function POST(request: Request): Promise<Response> {
  try {
    const body: unknown = await request.json();
    const input = validateWritingFeedbackRequest(body);
    const provider = getAiCapabilityProvider();
    const result = await provider.provideWritingFeedback({
      category: input.category,
      prompt: input.prompt,
      text: input.text
    });
    return Response.json(result, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    return toErrorResponse(error);
  }
}

function toErrorResponse(error: unknown): Response {
  const boundaryError =
    error instanceof AiBoundaryError
      ? error
      : error instanceof SyntaxError
        ? new AiBoundaryError(
            'INVALID_REQUEST',
            'The request body must be valid JSON.',
            400
          )
        : new AiBoundaryError(
            'INTERNAL_ERROR',
            'The capability request could not be completed.',
            500
          );
  const payload: AiErrorResponse = {
    error: { code: boundaryError.code, message: boundaryError.message }
  };
  return Response.json(payload, {
    status: boundaryError.status,
    headers: { 'Cache-Control': 'no-store' }
  });
}
