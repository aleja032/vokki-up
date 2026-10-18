const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const MAX_IMAGE_BYTES = 8 * 1024 * 1024
const MAX_REQUEST_BYTES = 12 * 1024 * 1024
const allowedImageTypes = new Set(['image/png', 'image/jpeg', 'image/webp'])

type Action = 'flashcards' | 'quiz' | 'writing-feedback' | 'image-vocabulary'
type JsonSchema = Record<string, unknown>

const schemas: Record<Action, JsonSchema> = {
  flashcards: {
    type: 'OBJECT', properties: { cards: { type: 'ARRAY', items: { type: 'OBJECT', properties: { front: { type: 'STRING' }, back: { type: 'STRING' }, example: { type: 'STRING' } }, required: ['front', 'back', 'example'] } } }, required: ['cards'],
  },
  quiz: {
    type: 'OBJECT', properties: { questions: { type: 'ARRAY', items: { type: 'OBJECT', properties: { question: { type: 'STRING' }, options: { type: 'ARRAY', items: { type: 'STRING' } }, answer: { type: 'STRING' }, explanation: { type: 'STRING' } }, required: ['question', 'options', 'answer', 'explanation'] } } }, required: ['questions'],
  },
  'writing-feedback': {
    type: 'OBJECT', properties: { correctedText: { type: 'STRING' }, feedback: { type: 'STRING' }, suggestions: { type: 'ARRAY', items: { type: 'STRING' } } }, required: ['correctedText', 'feedback', 'suggestions'],
  },
  'image-vocabulary': {
    type: 'OBJECT', properties: { words: { type: 'ARRAY', items: { type: 'OBJECT', properties: { word: { type: 'STRING' }, meaning: { type: 'STRING' } }, required: ['word', 'meaning'] } } }, required: ['words'],
  },
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
}

function failure(code: string, message: string, status: number) {
  return jsonResponse({ error: { code, message } }, status)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function validateText(body: Record<string, unknown>): string | null {
  if (typeof body.text !== 'string' || body.text.trim().length === 0) return 'Escribí el contenido que querés trabajar.'
  if (body.text.length > 5000) return 'El texto supera el límite de 5.000 caracteres.'
  return null
}

function validateImage(body: Record<string, unknown>): string | null {
  if (!isRecord(body.image) || typeof body.image.mimeType !== 'string' || typeof body.image.data !== 'string') return 'Adjuntá una imagen válida.'
  if (!allowedImageTypes.has(body.image.mimeType)) return 'Elegí una imagen PNG, JPEG o WebP.'
  const data = body.image.data
  if (!data || data.length > Math.ceil(MAX_IMAGE_BYTES * 4 / 3) + 4 || !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(data)) return 'La imagen no es válida o supera 8 MB.'
  const decodedBytes = Math.floor(data.length * 3 / 4) - (data.endsWith('==') ? 2 : data.endsWith('=') ? 1 : 0)
  if (decodedBytes === 0 || decodedBytes > MAX_IMAGE_BYTES) return 'La imagen no es válida o supera 8 MB.'
  const header = atob(data.slice(0, 32))
  const signatureMatches = body.image.mimeType === 'image/png'
    ? header.startsWith('\x89PNG\r\n\x1a\n')
    : body.image.mimeType === 'image/jpeg'
      ? header.startsWith('\xff\xd8\xff')
      : header.startsWith('RIFF') && header.slice(8, 12) === 'WEBP'
  if (!signatureMatches) return 'El contenido de la imagen no coincide con su formato.'
  return null
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(isNonEmptyString)
}

function isValidGenerated(action: Action, value: unknown): boolean {
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

async function readBoundedBody(request: Request): Promise<string | null> {
  if (!request.body) return ''
  const reader = request.body.getReader()
  const decoder = new TextDecoder()
  let text = ''
  let bytes = 0
  while (true) {
    const { done, value } = await reader.read()
    if (done) return text + decoder.decode()
    bytes += value.byteLength
    if (bytes > MAX_REQUEST_BYTES) {
      await reader.cancel()
      return null
    }
    text += decoder.decode(value, { stream: true })
  }
}

function promptFor(action: Action, text?: string): string {
  const prompts: Record<Action, string> = {
    flashcards: `Create up to 8 English study flashcards from this learner material. Give concise Spanish meanings and natural English examples. Return only the requested structured data.\n\n${text}`,
    quiz: `Create a short English-learning quiz with 5 multiple-choice questions based on this material. Use four options and concise Spanish explanations. The answer must exactly match one option.\n\n${text}`,
    'writing-feedback': `Give kind, concise English writing feedback in Spanish. Preserve the learner's intended meaning, provide corrected text, and list a few actionable suggestions.\n\n${text}`,
    'image-vocabulary': 'Identify up to 12 useful English words or short phrases clearly visible in this study image. For each, provide a concise Spanish meaning. Return an empty words list if none are legible.',
  }
  return prompts[action]
}

async function generate(action: Action, body: Record<string, unknown>, apiKey: string, model: string) {
  const parts: Record<string, unknown>[] = [{ text: promptFor(action, typeof body.text === 'string' ? body.text.trim() : undefined) }]
  if (action === 'image-vocabulary') {
    const image = body.image as { mimeType: string; data: string }
    parts.push({ inlineData: { mimeType: image.mimeType, data: image.data } })
  }
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
    method: 'POST',
    signal: AbortSignal.timeout(20_000),
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
    body: JSON.stringify({ contents: [{ role: 'user', parts }], generationConfig: { responseMimeType: 'application/json', responseSchema: schemas[action] } }),
  })
  if (!response.ok) throw new Error('gemini_unavailable')
  const rawResponse = await response.text()
  if (rawResponse.length > 128_000) throw new Error('gemini_invalid_response')
  const payload: unknown = JSON.parse(rawResponse)
  if (!isRecord(payload) || !Array.isArray(payload.candidates)) throw new Error('gemini_invalid_response')
  const candidate = payload.candidates[0]
  if (!isRecord(candidate) || !isRecord(candidate.content) || !Array.isArray(candidate.content.parts)) throw new Error('gemini_invalid_response')
  const responseText = candidate.content.parts.find((part) => isRecord(part) && typeof part.text === 'string')
  if (!isRecord(responseText) || typeof responseText.text !== 'string') throw new Error('gemini_invalid_response')
  const result: unknown = JSON.parse(responseText.text)
  if (!isValidGenerated(action, result)) throw new Error('gemini_invalid_response')
  return result
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (request.method !== 'POST') return failure('method_not_allowed', 'Usá una solicitud POST.', 405)
  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) {
    return failure('invalid_json', 'La solicitud debe ser JSON.', 415)
  }
  const contentLength = Number(request.headers.get('content-length') ?? 0)
  if (contentLength > MAX_REQUEST_BYTES) return failure('payload_too_large', 'La solicitud supera el límite permitido.', 413)

  let rawBody: string | null
  try { rawBody = await readBoundedBody(request) } catch { return failure('invalid_json', 'La solicitud no tiene un formato válido.', 400) }
  if (rawBody === null) return failure('payload_too_large', 'La solicitud supera el límite permitido.', 413)
  let body: unknown
  try { body = JSON.parse(rawBody) } catch { return failure('invalid_json', 'La solicitud no tiene un formato válido.', 400) }
  if (!isRecord(body) || typeof body.action !== 'string' || !['flashcards', 'quiz', 'writing-feedback', 'image-vocabulary'].includes(body.action)) {
    return failure('invalid_action', 'La acción solicitada no está disponible.', 400)
  }
  const action = body.action as Action
  const invalid = action === 'image-vocabulary' ? validateImage(body) : validateText(body)
  if (invalid) return failure(action === 'image-vocabulary' ? 'invalid_image' : 'invalid_text', invalid, 400)

  const apiKey = Deno.env.get('GEMINI_API_KEY')
  const model = Deno.env.get('GEMINI_MODEL')
  if (!apiKey || !model) return failure('ai_not_configured', 'La función de IA todavía no está configurada. Podés agregar palabras manualmente.', 503)
  try {
    return jsonResponse(await generate(action, body, apiKey, model))
  } catch {
    return failure('ai_request_failed', 'No pudimos completar la solicitud de IA. Probá de nuevo más tarde.', 502)
  }
})
