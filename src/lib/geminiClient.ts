export type AiAction = 'flashcards' | 'quiz' | 'writing-feedback' | 'image-vocabulary'

export type AiRequests = {
  flashcards: { text: string }
  quiz: { text: string }
  'writing-feedback': { text: string }
  'image-vocabulary': { image: { mimeType: string; data: string } }
}

export type AiResults = {
  flashcards: { cards: Array<{ front: string; back: string; example: string }> }
  quiz: { questions: Array<{ question: string; options: string[]; answer: string; explanation: string }> }
  'writing-feedback': { correctedText: string; feedback: string; suggestions: string[] }
  'image-vocabulary': { words: Array<{ word: string; meaning: string }> }
}

export type AiClientConfig = {
  url: string
  publishableKey: string
  fetcher?: typeof fetch
}

const IMAGE_LIMIT_BYTES = 8 * 1024 * 1024
const SUPPORTED_IMAGE_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp'])
const genericError = 'No pudimos conectar con la IA. Probá de nuevo o seguí sin conexión.'
const invalidResponseError = 'La IA devolvió una respuesta no válida. Probá de nuevo.'
const errorMessages: Record<string, string> = {
  invalid_action: 'La acción solicitada no está disponible.',
  invalid_image: 'Elegí una imagen PNG, JPEG o WebP de menos de 8 MB.',
  invalid_text: 'Escribí un texto de hasta 5.000 caracteres.',
  payload_too_large: 'La solicitud supera el límite permitido.',
  ai_not_configured: 'La IA todavía no está configurada. Podés seguir agregando palabras manualmente.',
  ai_request_failed: 'No pudimos completar la solicitud de IA. Probá de nuevo más tarde.',
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(isNonEmptyString)
}

function isValidResult(action: AiAction, value: unknown): boolean {
  if (!isRecord(value)) return false
  switch (action) {
    case 'flashcards':
      return Array.isArray(value.cards) && value.cards.length <= 8 && value.cards.every((card: unknown) =>
        isRecord(card) && isNonEmptyString(card.front) && isNonEmptyString(card.back) && isNonEmptyString(card.example))
    case 'quiz':
      return Array.isArray(value.questions) && value.questions.length <= 5 && value.questions.every((question: unknown) =>
        isRecord(question) && isNonEmptyString(question.question) && isStringArray(question.options)
        && question.options.length === 4 && isNonEmptyString(question.answer)
        && question.options.includes(question.answer) && isNonEmptyString(question.explanation))
    case 'writing-feedback':
      return isNonEmptyString(value.correctedText) && isNonEmptyString(value.feedback) && isStringArray(value.suggestions)
    case 'image-vocabulary':
      return Array.isArray(value.words) && value.words.length <= 12 && value.words.every((word: unknown) =>
        isRecord(word) && isNonEmptyString(word.word) && isNonEmptyString(word.meaning))
  }
}

export function getGeminiClientConfig(): Pick<AiClientConfig, 'url' | 'publishableKey'> | null {
  const url = import.meta.env.VITE_SUPABASE_URL?.trim()
  const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim()
  return url && publishableKey ? { url, publishableKey } : null
}

export function createGeminiClient({ url, publishableKey, fetcher = fetch }: AiClientConfig) {
  const endpoint = `${url.replace(/\/+$/, '')}/functions/v1/vokki-ai`

  async function request<A extends AiAction>(action: A, payload: AiRequests[A]): Promise<AiResults[A]> {
    if (action === 'image-vocabulary') {
      const image = (payload as AiRequests['image-vocabulary']).image
      if (!SUPPORTED_IMAGE_TYPES.has(image.mimeType)) throw new Error(errorMessages.invalid_image)
      const decodedBytes = Math.floor(image.data.length * 3 / 4) - (image.data.endsWith('==') ? 2 : image.data.endsWith('=') ? 1 : 0)
      if (!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(image.data)
        || decodedBytes < 1 || decodedBytes > IMAGE_LIMIT_BYTES) throw new Error(errorMessages.invalid_image)
    } else {
      const text = (payload as AiRequests['flashcards']).text
      if (!isNonEmptyString(text) || text.length > 5000) throw new Error(errorMessages.invalid_text)
    }

    let response: Response
    try {
      response = await fetcher(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: publishableKey,
          Authorization: `Bearer ${publishableKey}`,
        },
        body: JSON.stringify({ action, ...payload }),
      })
    } catch {
      throw new Error(genericError)
    }
    const result: unknown = await response.json().catch(() => null)
    if (!response.ok) {
      const code = isRecord(result) && isRecord(result.error) && typeof result.error.code === 'string'
        ? result.error.code : ''
      throw new Error(errorMessages[code] ?? genericError)
    }
    if (!isValidResult(action, result)) throw new Error(invalidResponseError)
    return result as AiResults[A]
  }

  return {
    request,
    async extractImageVocabulary(file: Blob): Promise<AiResults['image-vocabulary']> {
      if (!SUPPORTED_IMAGE_TYPES.has(file.type)) throw new Error(errorMessages.invalid_image)
      if (file.size === 0 || file.size > IMAGE_LIMIT_BYTES) throw new Error(errorMessages.invalid_image)
      const bytes = new Uint8Array(await file.arrayBuffer())
      let binary = ''
      for (const byte of bytes) binary += String.fromCharCode(byte)
      return request('image-vocabulary', { image: { mimeType: file.type, data: btoa(binary) } })
    },
  }
}

export function getConfiguredGeminiClient() {
  const config = getGeminiClientConfig()
  return config ? createGeminiClient(config) : null
}
