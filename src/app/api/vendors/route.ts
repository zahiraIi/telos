import { NextResponse } from 'next/server';
import { rankVendors } from '@/lib/agents/vendor';
import { SEED_VENDORS } from '@/lib/db/seed';

export async function POST(request: Request) {
  try {
    const { category } = await request.json();

    if (!category) {
      return NextResponse.json(
        { error: 'category is required' },
        { status: 400 },
      );
    }

    const rankings = rankVendors(SEED_VENDORS, category);
    return NextResponse.json({ rankings });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Vendor scoring failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ vendors: SEED_VENDORS });
}
