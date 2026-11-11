/** Same limit as the server request validation (`validateCardCaptureRequest`). */
export const MAX_CAPTURE_TERMS = 20;
export const MAX_CAPTURE_TEXT_LENGTH = 5000;

/** Counts the words or phrases in a free list, separated by commas, semicolons or lines. */
export function countCaptureTerms(text: string): number {
  return text.split(/[,;\n]+/).filter(term => term.trim().length > 0).length;
}
