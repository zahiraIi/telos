import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY ?? '';

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export function isGeminiConfigured(): boolean {
  return apiKey.length > 0;
}

export function getGeminiModel() {
  if (!genAI) {
    throw new Error(
      'GEMINI_API_KEY is not set. Add it to .env.local to enable AI classification and tone calibration.',
    );
  }
  return genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
}

export async function generateContent(prompt: string): Promise<string> {
  const model = getGeminiModel();
  const result = await model.generateContent(prompt);
  return result.response.text();
}
