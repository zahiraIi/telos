'use client';

import { useExecutionStore } from '@/stores/execution-store';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Activity } from 'lucide-react';

const typeStyles: Record<string, string> = {
  info: 'text-blue-500',
  success: 'text-emerald-500',
  error: 'text-red-500',
  warning: 'text-yellow-500',
};

export default function ExecutionLog() {
  const logs = useExecutionStore((s) => s.logs);

  return (
    <div className="flex h-[180px] shrink-0 flex-col border-t bg-card">
      <div className="flex items-center gap-2 border-b px-4 py-2">
        <Activity className="h-3.5 w-3.5 text-muted-foreground" />
        <h3 className="text-xs font-semibold">Execution Log</h3>
        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 ml-auto">
          {logs.length} entries
        </Badge>
      </div>
      <ScrollArea className="flex-1">
        {logs.length === 0 ? (
          <div className="flex h-full items-center justify-center p-4">
            <p className="text-xs text-muted-foreground">
              Run a workflow to see execution logs here.
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-3 px-4 py-2 text-xs hover:bg-accent/50 transition-colors"
              >
                <span className="shrink-0 text-muted-foreground font-mono">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
                <Badge
                  variant="outline"
                  className={cn(
                    'shrink-0 text-[10px] px-1.5 py-0',
                    typeStyles[log.type],
                  )}
                >
                  {log.nodeLabel}
                </Badge>
                <span className="text-foreground">{log.message}</span>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
