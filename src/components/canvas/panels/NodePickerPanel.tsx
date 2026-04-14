'use client';

import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import {
  TRIGGER_NODES,
  PROCESSOR_NODES,
  ACTION_NODES,
} from '@/lib/workflow/types';
import type { WorkflowNodeType } from '@/types';
import {
  MessageSquare,
  Clock,
  Play,
  Brain,
  HelpCircle,
  Star,
  Sliders,
  Database,
  Mail,
  MessageCircle,
  Bell,
  UserCheck,
  FileText,
  Bot,
  Search,
  type LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  MessageSquare,
  Clock,
  Play,
  Brain,
  HelpCircle,
  Star,
  Sliders,
  Database,
  Mail,
  MessageCircle,
  Bell,
  UserCheck,
  FileText,
  Bot,
};

const categoryConfig = {
  trigger: { label: 'Triggers', color: 'text-[#1baf75]', bg: 'bg-[#1baf75]/10' },
  processor: { label: 'Processing', color: 'text-[#4e5aff]', bg: 'bg-[#4e5aff]/10' },
  action: { label: 'Actions', color: 'text-[#ff6e4a]', bg: 'bg-[#ff6e4a]/10' },
} as const;

function NodeItem({ node }: { node: WorkflowNodeType }) {
  const Icon = iconMap[node.icon] ?? Brain;
  const cat = categoryConfig[node.category];

  const onDragStart = (event: React.DragEvent) => {
    event.dataTransfer.setData(
      'application/telos-node',
      JSON.stringify(node),
    );
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      className="flex items-center gap-3 rounded-lg border border-transparent p-2 cursor-grab transition-colors hover:border-border hover:bg-accent active:cursor-grabbing"
    >
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
          cat.bg,
        )}
      >
        <Icon className={cn('h-4 w-4', cat.color)} />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium leading-tight truncate">
          {node.label}
        </p>
        <p className="text-[11px] text-muted-foreground truncate">
          {node.description}
        </p>
      </div>
    </div>
  );
}

function NodeGroup({
  label,
  nodes,
  category,
}: {
  label: string;
  nodes: WorkflowNodeType[];
  category: 'trigger' | 'processor' | 'action';
}) {
  const cat = categoryConfig[category];
  if (nodes.length === 0) return null;
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 px-2 py-1">
        <span className={cn('text-xs font-semibold uppercase tracking-wider', cat.color)}>
          {label}
        </span>
        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
          {nodes.length}
        </Badge>
      </div>
      {nodes.map((node) => (
        <NodeItem key={node.type} node={node} />
      ))}
    </div>
  );
}

export default function NodePickerPanel() {
  const [search, setSearch] = useState('');
  const q = search.toLowerCase();

  const filter = (nodes: WorkflowNodeType[]) =>
    q
      ? nodes.filter(
          (n) =>
            n.label.toLowerCase().includes(q) ||
            n.description.toLowerCase().includes(q),
        )
      : nodes;

  return (
    <div className="flex h-full w-[260px] shrink-0 flex-col border-r bg-card">
      <div className="p-3 space-y-2">
        <h2 className="text-sm font-semibold">Nodes</h2>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search nodes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-sm"
          />
        </div>
      </div>
      <Separator />
      <ScrollArea className="flex-1 p-2">
        <div className="space-y-4">
          <NodeGroup label="Triggers" category="trigger" nodes={filter(TRIGGER_NODES)} />
          <NodeGroup label="Processing" category="processor" nodes={filter(PROCESSOR_NODES)} />
          <NodeGroup label="Actions" category="action" nodes={filter(ACTION_NODES)} />
        </div>
      </ScrollArea>
    </div>
  );
}
