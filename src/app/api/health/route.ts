import { NextResponse } from 'next/server';
import { isGeminiConfigured } from '@/lib/gemini/client';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    gemini: isGeminiConfigured(),
    timestamp: new Date().toISOString(),
  });
}
