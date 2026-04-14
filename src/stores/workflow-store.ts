import { create } from 'zustand';
import type { Node, Edge } from '@xyflow/react';
import type { WorkflowNodeData } from '@/types';

interface WorkflowState {
  nodes: Node<WorkflowNodeData>[];
  edges: Edge[];
  selectedNodeId: string | null;
  workflowName: string;
  setNodes: (nodes: Node<WorkflowNodeData>[]) => void;
  setEdges: (edges: Edge[]) => void;
  updateNodes: (updater: (nodes: Node<WorkflowNodeData>[]) => Node<WorkflowNodeData>[]) => void;
  updateEdges: (updater: (edges: Edge[]) => Edge[]) => void;
  selectNode: (id: string | null) => void;
  setWorkflowName: (name: string) => void;
  updateNodeData: (nodeId: string, data: Partial<WorkflowNodeData>) => void;
}

export const useWorkflowStore = create<WorkflowState>((set) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  workflowName: 'Maintenance Triage',

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  updateNodes: (updater) =>
    set((state) => ({ nodes: updater(state.nodes) })),

  updateEdges: (updater) =>
    set((state) => ({ edges: updater(state.edges) })),

  selectNode: (id) => set({ selectedNodeId: id }),

  setWorkflowName: (name) => set({ workflowName: name }),

  updateNodeData: (nodeId, data) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...data } }
          : node
      ),
    })),
}));
