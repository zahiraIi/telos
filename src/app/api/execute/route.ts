import { NextResponse } from 'next/server';
import { executeNode, type PipelineContext } from '@/lib/agents/orchestrator';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nodeType, context } = body as {
      nodeType: string;
      context?: PipelineContext;
    };

    if (!nodeType) {
      return NextResponse.json(
        { error: 'nodeType is required' },
        { status: 400 },
      );
    }

    const result = await executeNode(nodeType, context ?? {});
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Execution failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
