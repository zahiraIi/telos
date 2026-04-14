import { NextResponse } from 'next/server';
import { SEED_TICKETS } from '@/lib/db/seed';

export async function GET() {
  return NextResponse.json({ tickets: SEED_TICKETS });
}
