import { generateContent } from '@/lib/gemini/client';
import { toneCalibrationPrompt } from '@/lib/gemini/prompts';
import type { Tenant } from '@/types';

type ReminderStage = 'friendly' | 'nudge' | 'firm' | 'escalation';

export function determineStage(daysUntilDue: number): ReminderStage {
  if (daysUntilDue >= 5) return 'friendly';
  if (daysUntilDue >= 1) return 'nudge';
  if (daysUntilDue >= -1) return 'firm';
  return 'escalation';
}

export function calculateOnTimePercentage(tenant: Tenant): number {
  const history = tenant.payment_history;
  if (history.length === 0) return 100;

  const onTimeCount = history.filter((p) => {
    const dueDay = tenant.rent_due_day;
    const paidDate = new Date(p.paid_date);
    return paidDate.getDate() <= dueDay + 1;
  }).length;

  return Math.round((onTimeCount / history.length) * 100);
}

export async function generateRentReminder(
  tenant: Tenant,
  daysUntilDue: number,
): Promise<{ message: string; stage: ReminderStage; onTimePercentage: number }> {
  const stage = determineStage(daysUntilDue);
  const onTimePercentage = calculateOnTimePercentage(tenant);

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + daysUntilDue);
  const dueDateStr = dueDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  try {
    const message = await generateContent(
      toneCalibrationPrompt(
        tenant.name,
        tenant.rent_amount,
        dueDateStr,
        daysUntilDue,
        onTimePercentage,
        stage,
      ),
    );
    return { message: message.trim(), stage, onTimePercentage };
  } catch {
    const fallback =
      stage === 'friendly'
        ? `Hi ${tenant.name}, just a heads up — rent of $${tenant.rent_amount} is due on ${dueDateStr}.`
        : `Your rent payment of $${tenant.rent_amount} was due on ${dueDateStr}. Please submit payment.`;
    return { message: fallback, stage, onTimePercentage };
  }
}
