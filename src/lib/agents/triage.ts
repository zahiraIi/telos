import { generateContent } from '@/lib/gemini/client';
import { triagePrompt } from '@/lib/gemini/prompts';
import type { TriageResult } from '@/types';

export async function triageMessage(
  message: string,
  propertyType = 'apartment',
  buildingAge = '10 years',
): Promise<TriageResult> {
  const prompt = triagePrompt(message, propertyType, buildingAge);

  try {
    const text = await generateContent(prompt);
    const cleaned = text.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleaned) as TriageResult;
  } catch (err) {
    console.error('[triage] Gemini call failed:', err instanceof Error ? err.message : err);
    return {
      category: 'general',
      urgency: 3,
      issue_type: 'Unable to classify — forwarding to landlord',
      follow_up_question: null,
      diy_possible: false,
      diy_suggestion: null,
      safety_concern: false,
    };
  }
}
