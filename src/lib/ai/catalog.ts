export const AI_PROVIDER_CATALOG = [
  {
    id: 'gemini',
    label: 'Gemini',
    description: 'Modelos Gemini',
    models: ['gemini-3.1-flash-lite', 'gemini-2.5-flash', 'gemini-2.5-pro']
  },
  {
    id: 'openai',
    label: 'OpenAI',
    description: 'Modelos GPT',
    models: ['gpt-4o-mini', 'gpt-4o']
  }
] as const;

export type AiProviderId = (typeof AI_PROVIDER_CATALOG)[number]['id'];
export type AiModelId = (typeof AI_PROVIDER_CATALOG)[number]['models'][number];

export const DEFAULT_AI_SELECTION = {
  provider: AI_PROVIDER_CATALOG[0].id,
  model: AI_PROVIDER_CATALOG[0].models[0]
} satisfies AiSelection;

export type AiSelection = {
  provider: AiProviderId;
  model: AiModelId;
};

// These names are reserved for a future server-side adapter. This step never reads them.
export const FUTURE_AI_ENVIRONMENT_VARIABLES = [
  'GEMINI_API_KEY',
  'OPENAI_API_KEY',
  'AI_GATEWAY_API_KEY'
] as const;
