import { create } from 'zustand';
import type { ExecutionLogEntry, NodeStatus } from '@/types';

interface ExecutionState {
  isExecuting: boolean;
  nodeStatuses: Record<string, NodeStatus>;
  logs: ExecutionLogEntry[];
  setExecuting: (executing: boolean) => void;
  setNodeStatus: (nodeId: string, status: NodeStatus) => void;
  resetStatuses: () => void;
  addLog: (entry: Omit<ExecutionLogEntry, 'id' | 'timestamp'>) => void;
  clearLogs: () => void;
}

export const useExecutionStore = create<ExecutionState>((set) => ({
  isExecuting: false,
  nodeStatuses: {},
  logs: [],

  setExecuting: (executing) => set({ isExecuting: executing }),

  setNodeStatus: (nodeId, status) =>
    set((state) => ({
      nodeStatuses: { ...state.nodeStatuses, [nodeId]: status },
    })),

  resetStatuses: () => set({ nodeStatuses: {} }),

  addLog: (entry) =>
    set((state) => ({
      logs: [
        {
          ...entry,
          id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          timestamp: new Date().toISOString(),
        },
        ...state.logs,
      ],
    })),

  clearLogs: () => set({ logs: [] }),
}));
