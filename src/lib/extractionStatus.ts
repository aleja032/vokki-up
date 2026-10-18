export type ExtractionStatus = {
  noteId: string
  kind: 'notice' | 'error'
  message: string
}

export function visibleExtractionStatus(status: ExtractionStatus | null, noteId?: string): ExtractionStatus | null {
  return status?.noteId === noteId ? status : null
}
