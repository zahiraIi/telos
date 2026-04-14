import { NextResponse } from 'next/server';
import { generateRentReminder } from '@/lib/agents/comms';
import { SEED_TENANTS } from '@/lib/db/seed';

export async function POST(request: Request) {
  try {
    const { tenant_id, days_until_due } = await request.json();

    const tenant = SEED_TENANTS.find((t) => t.tenant_id === tenant_id);
    if (!tenant) {
      return NextResponse.json(
        { error: 'Tenant not found' },
        { status: 404 },
      );
    }

    const result = await generateRentReminder(tenant, days_until_due ?? 5);
    return NextResponse.json(result);
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Communication failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
