'use client';

import { useCallback } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  MiniMap,
  Controls,
  addEdge,
  useNodesState,
  useEdgesState,
  useReactFlow,
  type Connection,
  type Node,
  ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import BaseNode from './nodes/BaseNode';
import AnimatedEdge from './edges/AnimatedEdge';
import NodePickerPanel from './panels/NodePickerPanel';
import NodeDetailPanel from './panels/NodeDetailPanel';
import ExecutionLog from './panels/ExecutionLog';
import CanvasToolbar from './controls/CanvasToolbar';
import { useWorkflowStore } from '@/stores/workflow-store';
import { useExecutionStore } from '@/stores/execution-store';
import type { WorkflowNodeData, WorkflowNodeType } from '@/types';

const nodeTypes = { baseNode: BaseNode };
const edgeTypes = { animatedEdge: AnimatedEdge };

function Canvas({
  initialNodes,
  initialEdges,
}: {
  initialNodes: Node<WorkflowNodeData>[];
  initialEdges: import('@xyflow/react').Edge[];
}) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { screenToFlowPosition } = useReactFlow();

  const storeSetNodes = useWorkflowStore((s) => s.setNodes);
  const storeSetEdges = useWorkflowStore((s) => s.setEdges);
  const selectNode = useWorkflowStore((s) => s.selectNode);
  const selectedNodeId = useWorkflowStore((s) => s.selectedNodeId);
  const setExecuting = useExecutionStore((s) => s.setExecuting);
  const setNodeStatus = useExecutionStore((s) => s.setNodeStatus);
  const addLog = useExecutionStore((s) => s.addLog);
  const resetStatuses = useExecutionStore((s) => s.resetStatuses);

  const syncStore = useCallback(() => {
    storeSetNodes(nodes);
    storeSetEdges(edges);
  }, [nodes, edges, storeSetNodes, storeSetEdges]);

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge({ ...params, type: 'animatedEdge' }, eds));
    },
    [setEdges],
  );

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const data = event.dataTransfer.getData('application/telos-node');
      if (!data) return;

      const nodeType: WorkflowNodeType = JSON.parse(data);

      const position = screenToFlowPosition({
        x: event.clientX - 90,
        y: event.clientY - 35,
      });

      const newNode: Node<WorkflowNodeData> = {
        id: `${nodeType.type}-${Date.now()}`,
        type: 'baseNode',
        position,
        data: {
          label: nodeType.label,
          category: nodeType.category,
          icon: nodeType.icon,
          description: nodeType.description,
          nodeType: nodeType.type,
          status: 'idle',
        },
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [setNodes, screenToFlowPosition],
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onPaneClick = useCallback(() => {
    selectNode(null);
  }, [selectNode]);

  const executeWorkflow = useCallback(async () => {
    syncStore();
    resetStatuses();
    setExecuting(true);

    const nodeOrder = getExecutionOrder(nodes, edges);
    let pipelineContext: Record<string, unknown> = {};

    for (const nodeId of nodeOrder) {
      const node = nodes.find((n) => n.id === nodeId);
      if (!node) continue;

      setNodeStatus(nodeId, 'running');
      addLog({
        nodeId,
        nodeLabel: node.data.label,
        message: `Processing ${node.data.label}...`,
        type: 'info',
      });

      try {
        const response = await fetch('/api/execute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nodeType: node.data.nodeType,
            context: pipelineContext,
          }),
        });

        const result = await response.json();

        if (result.error) {
          throw new Error(result.error);
        }

        pipelineContext = { ...pipelineContext, ...result };

        setNodes((nds) =>
          nds.map((n) =>
            n.id === nodeId
              ? { ...n, data: { ...n.data, output: result, status: 'success' as const } }
              : n,
          ),
        );

        setNodeStatus(nodeId, 'success');
        addLog({
          nodeId,
          nodeLabel: node.data.label,
          message: result.summary ?? `${node.data.label} completed successfully`,
          type: 'success',
          data: result,
        });

        await new Promise((r) => setTimeout(r, 600));
      } catch (err) {
        setNodeStatus(nodeId, 'error');
        addLog({
          nodeId,
          nodeLabel: node.data.label,
          message: `${node.data.label} failed: ${err instanceof Error ? err.message : 'Unknown error'}`,
          type: 'error',
        });
      }
    }

    setExecuting(false);
  }, [nodes, edges, syncStore, resetStatuses, setExecuting, setNodeStatus, addLog, setNodes]);

  return (
    <div className="flex h-full flex-col">
      <CanvasToolbar onExecute={executeWorkflow} />

      <div className="flex flex-1 overflow-hidden">
        <NodePickerPanel />

        <div className="flex-1" onDrop={onDrop} onDragOver={onDragOver}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            fitViewOptions={{ padding: 0.3 }}
            className="bg-background"
            proOptions={{ hideAttribution: true }}
          >
            <Background
              variant={BackgroundVariant.Dots}
              gap={20}
              size={1}
              className="!bg-background"
            />
            <Controls
              showInteractive={false}
              className="!border !border-border !bg-card !shadow-sm"
            />
            <MiniMap
              className="!bg-card !border !border-border !shadow-sm"
              nodeColor={() => '#6b7280'}
              maskColor="rgba(0, 0, 0, 0.1)"
            />
            <svg>
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
            </svg>
          </ReactFlow>
        </div>

        {selectedNodeId && <NodeDetailPanel />}
      </div>

      <ExecutionLog />
    </div>
  );
}

function getExecutionOrder(
  nodes: Node<WorkflowNodeData>[],
  edges: import('@xyflow/react').Edge[],
): string[] {
  const adjacency = new Map<string, string[]>();
  const inDegree = new Map<string, number>();

  for (const node of nodes) {
    adjacency.set(node.id, []);
    inDegree.set(node.id, 0);
  }

  for (const edge of edges) {
    adjacency.get(edge.source)?.push(edge.target);
    inDegree.set(edge.target, (inDegree.get(edge.target) ?? 0) + 1);
  }

  const queue: string[] = [];
  for (const [id, degree] of inDegree) {
    if (degree === 0) queue.push(id);
  }

  const order: string[] = [];
  while (queue.length > 0) {
    const current = queue.shift()!;
    order.push(current);
    for (const neighbor of adjacency.get(current) ?? []) {
      const newDegree = (inDegree.get(neighbor) ?? 1) - 1;
      inDegree.set(neighbor, newDegree);
      if (newDegree === 0) queue.push(neighbor);
    }
  }

  return order;
}

export default function WorkflowCanvas({
  initialNodes,
  initialEdges,
}: {
  initialNodes: Node<WorkflowNodeData>[];
  initialEdges: import('@xyflow/react').Edge[];
}) {
  return (
    <ReactFlowProvider>
      <Canvas initialNodes={initialNodes} initialEdges={initialEdges} />
    </ReactFlowProvider>
  );
}
