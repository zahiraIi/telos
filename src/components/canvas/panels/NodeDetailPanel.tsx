'use client';

import { useWorkflowStore } from '@/stores/workflow-store';
import { useExecutionStore } from '@/stores/execution-store';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const statusColors: Record<string, string> = {
  idle: 'bg-muted text-muted-foreground',
  running: 'bg-blue-500/20 text-blue-600',
  success: 'bg-emerald-500/20 text-emerald-600',
  error: 'bg-red-500/20 text-red-600',
  waiting: 'bg-yellow-500/20 text-yellow-600',
};

export default function NodeDetailPanel() {
  const selectedNodeId = useWorkflowStore((s) => s.selectedNodeId);
  const nodes = useWorkflowStore((s) => s.nodes);
  const selectNode = useWorkflowStore((s) => s.selectNode);
  const nodeStatuses = useExecutionStore((s) => s.nodeStatuses);
  const logs = useExecutionStore((s) => s.logs);

  const node = nodes.find((n) => n.id === selectedNodeId);

  if (!node) return null;

  const status = nodeStatuses[node.id] ?? 'idle';
  const nodeLogs = logs.filter((l) => l.nodeId === node.id);

  return (
    <div className="flex h-full w-[320px] shrink-0 flex-col border-l bg-card animate-in slide-in-from-right-4 duration-200">
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold truncate">{node.data.label}</h2>
          <Badge className={cn('text-[10px]', statusColors[status])}>
            {status}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => selectNode(null)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <Separator />

      <Tabs defaultValue="config" className="flex-1 flex flex-col">
        <TabsList className="mx-3 mt-2">
          <TabsTrigger value="config" className="text-xs">Config</TabsTrigger>
          <TabsTrigger value="output" className="text-xs">Output</TabsTrigger>
          <TabsTrigger value="logs" className="text-xs">Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="config" className="flex-1 p-0 mt-0">
          <ScrollArea className="h-full p-3">
            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  Node Type
                </p>
                <p className="text-sm">{node.data.nodeType}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  Category
                </p>
                <Badge
                  variant="outline"
                  className={cn(
                    'text-xs capitalize',
                    node.data.category === 'trigger' && 'border-emerald-500/50 text-emerald-600',
                    node.data.category === 'processor' && 'border-blue-500/50 text-blue-600',
                    node.data.category === 'action' && 'border-orange-500/50 text-orange-600',
                  )}
                >
                  {node.data.category}
                </Badge>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  Description
                </p>
                <p className="text-sm text-muted-foreground">
                  {node.data.description}
                </p>
              </div>
              {node.data.config && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    Parameters
                  </p>
                  <pre className="rounded-md bg-muted p-2 text-xs overflow-auto">
                    {JSON.stringify(node.data.config, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="output" className="flex-1 p-0 mt-0">
          <ScrollArea className="h-full p-3">
            {node.data.output ? (
              <pre className="rounded-md bg-muted p-2 text-xs overflow-auto whitespace-pre-wrap">
                {JSON.stringify(node.data.output, null, 2)}
              </pre>
            ) : (
              <p className="text-sm text-muted-foreground">
                No output yet. Run the workflow to see results.
              </p>
            )}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="logs" className="flex-1 p-0 mt-0">
          <ScrollArea className="h-full p-3">
            {nodeLogs.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No logs for this node yet.
              </p>
            ) : (
              <div className="space-y-2">
                {nodeLogs.map((log) => (
                  <div
                    key={log.id}
                    className="rounded-md border p-2 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="outline"
                        className={cn(
                          'text-[10px]',
                          log.type === 'success' && 'text-emerald-600',
                          log.type === 'error' && 'text-red-600',
                          log.type === 'warning' && 'text-yellow-600',
                        )}
                      >
                        {log.type}
                      </Badge>
                      <span className="text-muted-foreground">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p>{log.message}</p>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
