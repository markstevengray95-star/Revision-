import { GoogleGenerativeAI } from '@google/generative-ai';

export const GEMINI_PRIMARY_MODEL = 'gemini-3.5-flash';
export const GEMINI_FALLBACK_MODELS = [
  'gemini-3.8-flash',
  'gemini-3.7-flash',
  'gemini-2.5-flash',
] as const;

export const GEMINI_MODEL_CHAIN = [
  GEMINI_PRIMARY_MODEL,
  ...GEMINI_FALLBACK_MODELS,
] as const;

export async function generateWithGeminiFallback({
  apiKey,
  generationConfig,
  contents,
}: {
  apiKey: string;
  generationConfig?: Record<string, unknown>;
  contents: unknown;
}) {
  const genAI = new GoogleGenerativeAI(apiKey);
  let lastError: unknown;

  for (let index = 0; index < GEMINI_MODEL_CHAIN.length; index += 1) {
    const modelName = GEMINI_MODEL_CHAIN[index];
    const nextModel = GEMINI_MODEL_CHAIN[index + 1];

    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: generationConfig as any,
      });
      const result = await model.generateContent(contents as any);
      return { result, modelName };
    } catch (error) {
      lastError = error;
      console.warn(
        `Gemini model ${modelName} failed; ${nextModel ? `trying ${nextModel}` : 'no more fallbacks available'}.`,
        error,
      );
    }
  }

  throw lastError instanceof Error ? lastError : new Error('All configured Gemini models failed.');
}

