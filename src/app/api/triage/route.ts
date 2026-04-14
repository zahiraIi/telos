import { NextResponse } from 'next/server';
import { triageMessage } from '@/lib/agents/triage';

export async function POST(request: Request) {
  try {
    const { message, propertyType, buildingAge } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'message is required' },
        { status: 400 },
      );
    }

    const result = await triageMessage(message, propertyType, buildingAge);
    return NextResponse.json(result);
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Triage failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
