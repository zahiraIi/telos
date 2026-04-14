'use client';

import { useWorkflowStore } from '@/stores/workflow-store';
import { useExecutionStore } from '@/stores/execution-store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Play,
  Square,
  ZoomIn,
  ZoomOut,
  Maximize,
  Building2,
} from 'lucide-react';
import { useReactFlow } from '@xyflow/react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const workflows = [
  { id: 'triage', label: 'Maintenance Triage' },
  { id: 'rent', label: 'Rent Reminders' },
  { id: 'inquiry', label: 'Tenant Inquiries' },
];

export default function CanvasToolbar({
  onExecute,
}: {
  onExecute: () => void;
}) {
  const workflowName = useWorkflowStore((s) => s.workflowName);
  const isExecuting = useExecutionStore((s) => s.isExecuting);
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const params = useParams();
  const currentId = params?.id as string;

  return (
    <div className="flex h-12 shrink-0 items-center justify-between border-b bg-card px-4">
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
            <Building2 className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-sm font-bold tracking-tight">Telos</span>
        </Link>

        <span className="text-muted-foreground">/</span>

        <div className="flex items-center gap-1">
          {workflows.map((wf) => (
            <Link key={wf.id} href={`/workflow/${wf.id}`}>
              <Button
                variant={currentId === wf.id ? 'secondary' : 'ghost'}
                size="sm"
                className="h-7 text-xs"
              >
                {wf.label}
              </Button>
            </Link>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Badge variant="outline" className="text-[10px] mr-2">
          {workflowName}
        </Badge>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => zoomOut()}
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => zoomIn()}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => fitView({ padding: 0.2 })}
        >
          <Maximize className="h-4 w-4" />
        </Button>

        <div className="mx-2 h-6 w-px bg-border" />

        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="h-8 text-xs">
            Dashboard
          </Button>
        </Link>

        {isExecuting ? (
          <Button variant="destructive" size="sm" disabled className="h-8">
            <Square className="mr-1.5 h-3.5 w-3.5" />
            Running...
          </Button>
        ) : (
          <Button size="sm" className="h-8" onClick={onExecute}>
            <Play className="mr-1.5 h-3.5 w-3.5" />
            Execute
          </Button>
        )}
      </div>
    </div>
  );
}
