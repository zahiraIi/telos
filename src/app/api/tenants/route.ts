import { NextResponse } from 'next/server';
import { SEED_TENANTS } from '@/lib/db/seed';

export async function GET() {
  return NextResponse.json({ tenants: SEED_TENANTS });
}
