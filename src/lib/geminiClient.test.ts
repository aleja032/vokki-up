import { describe, expect, it, vi } from 'vitest'
import { createGeminiClient, type AiAction } from './geminiClient'
import { visibleExtractionStatus } from './extractionStatus'

describe('Gemini edge-function client', () => {
  it('sends a typed action to the configured Supabase function without a Gemini key', async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify({ cards: [{ front: 'bright', back: 'brillante', example: 'A bright room.' }] }), { status: 200 }))
    const client = createGeminiClient({ url: 'https://study.example', publishableKey: 'public-key', fetcher })

    const result = await client.request('flashcards', { text: 'bright' })

    expect(fetcher).toHaveBeenCalledWith('https://study.example/functions/v1/vokki-ai', expect.objectContaining({
      method: 'POST',
      headers: expect.objectContaining({ apikey: 'public-key', Authorization: 'Bearer public-key' }),
    }))
    const request = fetcher.mock.calls[0][1]
    expect(JSON.parse(String(request?.body))).toEqual({ action: 'flashcards', text: 'bright' })
    expect(JSON.stringify(request?.headers)).not.toContain('gemini')
    expect(result).toEqual({ cards: [{ front: 'bright', back: 'brillante', example: 'A bright room.' }] })
  })

  it('encodes an image as a bounded MIME-tagged inline payload', async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify({ words: [{ word: 'bridge', meaning: 'puente' }] }), { status: 200 }))
    const client = createGeminiClient({ url: 'https://study.example/', publishableKey: 'public-key', fetcher })
    const file = new File([new Uint8Array([1, 2, 3])], 'photo.png', { type: 'image/png' })

    await client.extractImageVocabulary(file)

    expect(JSON.parse(String(fetcher.mock.calls[0][1]?.body))).toEqual({
      action: 'image-vocabulary', image: { mimeType: 'image/png', data: 'AQID' },
    })
  })

  it('surfaces safe server error messages and rejects unsupported image payloads before fetch', async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify({ error: { code: 'invalid_image', message: 'Choose a PNG, JPEG, or WebP image.' } }), { status: 400 }))
    const client = createGeminiClient({ url: 'https://study.example', publishableKey: 'public-key', fetcher })
    await expect(client.request('quiz', { text: 'hello' })).rejects.toThrow('PNG, JPEG o WebP')
    await expect(client.extractImageVocabulary(new File(['x'], 'text.txt', { type: 'text/plain' }))).rejects.toThrow('PNG, JPEG o WebP')
    expect(fetcher).toHaveBeenCalledTimes(1)
  })

  it('accepts only supported action names at the typed boundary', async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify({ correctedText: 'I went to the shop.', feedback: 'Bien.', suggestions: [] }), { status: 200 }))
    const client = createGeminiClient({ url: 'https://study.example', publishableKey: 'public-key', fetcher })
    const action: AiAction = 'writing-feedback'
    await client.request(action, { text: 'I went to the shop.' })
    expect(JSON.parse(String(fetcher.mock.calls[0][1]?.body)).action).toBe('writing-feedback')
  })

  it('rejects malformed AI output instead of exposing it to the candidate workflow', async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify({ words: [{ word: 42, meaning: 'puente' }] }), { status: 200 }))
    const client = createGeminiClient({ url: 'https://study.example', publishableKey: 'public-key', fetcher })
    await expect(client.extractImageVocabulary(new File(['x'], 'photo.png', { type: 'image/png' }))).rejects.toThrow('respuesta no válida')
  })

  it('does not expose untrusted service errors or network details', async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValueOnce(new Response(JSON.stringify({ error: { message: 'secret upstream detail' } }), { status: 502 }))
      .mockRejectedValueOnce(new Error('private hostname'))
    const client = createGeminiClient({ url: 'https://study.example', publishableKey: 'public-key', fetcher })
    await expect(client.request('quiz', { text: 'hello' })).rejects.not.toThrow('secret upstream detail')
    await expect(client.request('quiz', { text: 'hello' })).rejects.not.toThrow('private hostname')
  })

  it('rejects oversized images before contacting the function', async () => {
    const fetcher = vi.fn<typeof fetch>()
    const client = createGeminiClient({ url: 'https://study.example', publishableKey: 'public-key', fetcher })
    await expect(client.extractImageVocabulary(new File([new Uint8Array(8 * 1024 * 1024 + 1)], 'photo.png', { type: 'image/png' }))).rejects.toThrow('8 MB')
    expect(fetcher).not.toHaveBeenCalled()
  })
})

describe('note-scoped extraction status', () => {
  it('does not show one note’s completed extraction on another active note', () => {
    const status = { noteId: 'note-a', kind: 'notice' as const, message: 'Suggestions ready.' }
    expect(visibleExtractionStatus(status, 'note-b')).toBeNull()
    expect(visibleExtractionStatus(status, 'note-a')).toEqual(status)
  })
})
