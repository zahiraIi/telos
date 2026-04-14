'use client';

import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { cn } from '@/lib/utils';
import { useExecutionStore } from '@/stores/execution-store';
import { useWorkflowStore } from '@/stores/workflow-store';
import type { WorkflowNodeData, NodeCategory } from '@/types';
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
  type LucideIcon,
  Check,
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

const categoryStyles: Record<
  NodeCategory,
  { bg: string; iconBg: string; text: string; glow: string }
> = {
  trigger: {
    bg: 'bg-[#242428]',
    iconBg: 'bg-[#1baf75]',
    text: 'text-[#1baf75]',
    glow: 'shadow-[0_0_12px_4px_rgba(27,175,117,0.3)]',
  },
  processor: {
    bg: 'bg-[#242428]',
    iconBg: 'bg-[#4e5aff]',
    text: 'text-[#4e5aff]',
    glow: 'shadow-[0_0_12px_4px_rgba(78,90,255,0.3)]',
  },
  action: {
    bg: 'bg-[#242428]',
    iconBg: 'bg-[#ff6e4a]',
    text: 'text-[#ff6e4a]',
    glow: 'shadow-[0_0_12px_4px_rgba(255,110,74,0.3)]',
  },
};

function BaseNode({ id, data }: NodeProps & { data: WorkflowNodeData }) {
  const status = useExecutionStore((s) => s.nodeStatuses[id] ?? 'idle');
  const selectedNodeId = useWorkflowStore((s) => s.selectedNodeId);
  const selectNode = useWorkflowStore((s) => s.selectNode);
  const style = categoryStyles[data.category];
  const Icon = iconMap[data.icon] ?? Brain;
  const isSelected = selectedNodeId === id;

  return (
    <div
      className="relative flex flex-col items-center group cursor-pointer"
      onClick={() => selectNode(id)}
    >
      <div
        className={cn(
          'relative flex h-[50px] w-[200px] rounded-lg border border-[#3b3b40] shadow-sm transition-all duration-200',
          style.bg,
          isSelected && 'ring-2 ring-[#4e5aff] ring-offset-1 ring-offset-background',
          status === 'running' && `animate-pulse ${style.glow}`,
          status === 'success' && 'border-emerald-500',
          status === 'error' && 'border-red-500',
          status === 'waiting' && 'border-yellow-500',
        )}
      >
        <Handle
          type="target"
          position={Position.Left}
          className="!w-2 !h-2 !bg-[#7c828d] !border-none !-ml-1 hover:!scale-150 transition-transform"
        />

        <div
          className={cn(
            'flex h-full w-[50px] shrink-0 items-center justify-center rounded-l-md',
            style.iconBg,
          )}
        >
          <Icon className="h-6 w-6 text-white" strokeWidth={2} />
        </div>
        
        <div className="flex h-full flex-1 items-center justify-between px-3 min-w-0">
          <p className="text-[13px] font-medium text-white truncate leading-tight">
            {data.label}
          </p>

          {status === 'success' && (
            <div className="ml-2 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500">
              <Check className="h-3 w-3 text-white" strokeWidth={3} />
            </div>
          )}
          {status === 'running' && (
            <div className="ml-2 h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-white/50 border-t-white" />
          )}
          {status === 'error' && (
            <div className="ml-2 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-red-500">
              <span className="text-[10px] font-bold text-white leading-none">!</span>
            </div>
          )}
          {status === 'waiting' && (
            <div className="ml-2 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-yellow-500">
              <Clock className="h-3 w-3 text-white" />
            </div>
          )}
        </div>

        <Handle
          type="source"
          position={Position.Right}
          className="!w-2 !h-2 !bg-[#7c828d] !border-none !-mr-1 hover:!scale-150 transition-transform"
        />
      </div>

      {/* Description below the node like n8n */}
      <div className="absolute top-[100%] mt-1 text-center w-[240px]">
        <p className="text-[11px] text-[#7c828d] leading-snug">
          {data.description}
        </p>
      </div>
    </div>
  );
}

export default memo(BaseNode);
