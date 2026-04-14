import { NextResponse } from 'next/server';
import { SEED_PROPERTIES } from '@/lib/db/seed';

export async function GET() {
  return NextResponse.json({ properties: SEED_PROPERTIES });
}
