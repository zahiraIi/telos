import type { Node, Edge } from '@xyflow/react';
import dagre from 'dagre';
import type { WorkflowNodeData } from '@/types';
import { NODE_TYPES } from './types';

function findNodeType(type: string) {
  const nt = NODE_TYPES.find((n) => n.type === type);
  if (!nt) throw new Error(`Unknown node type: ${type}`);
  return nt;
}

function makeNode(
  id: string,
  type: string,
  overrides?: Partial<WorkflowNodeData>,
): Node<WorkflowNodeData> {
  const nt = findNodeType(type);
  return {
    id,
    type: 'baseNode',
    position: { x: 0, y: 0 },
    data: {
      label: overrides?.label ?? nt.label,
      category: nt.category,
      icon: nt.icon,
      description: overrides?.description ?? nt.description,
      nodeType: nt.type,
      status: 'idle',
      ...overrides,
    },
  };
}

function makeEdge(source: string, target: string): Edge {
  return {
    id: `e-${source}-${target}`,
    source,
    target,
    type: 'animatedEdge',
    animated: false,
  };
}

const NODE_WIDTH = 240;
const NODE_HEIGHT = 80;

export function layoutWorkflow(
  nodes: Node<WorkflowNodeData>[],
  edges: Edge[],
): { nodes: Node<WorkflowNodeData>[]; edges: Edge[] } {
  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: 'LR', nodesep: 60, ranksep: 80 });
  g.setDefaultEdgeLabel(() => ({}));

  nodes.forEach((node) => {
    g.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  });

  edges.forEach((edge) => {
    g.setEdge(edge.source, edge.target);
  });

  dagre.layout(g);

  const layoutedNodes = nodes.map((node) => {
    const pos = g.node(node.id);
    return {
      ...node,
      position: {
        x: pos.x - NODE_WIDTH / 2,
        y: pos.y - NODE_HEIGHT / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
}

export function getTriageWorkflow() {
  const nodes: Node<WorkflowNodeData>[] = [
    makeNode('trigger-1', 'tenantMessage'),
    makeNode('classify-1', 'geminiClassify'),
    makeNode('followup-1', 'followUpQuestion'),
    makeNode('vendor-1', 'vendorScore'),
    makeNode('assign-1', 'assignVendor'),
    makeNode('notify-1', 'notifyLandlord'),
    makeNode('email-1', 'sendEmail', {
      label: 'Confirm Tenant',
      description: 'Send tenant confirmation',
    }),
  ];

  const edges: Edge[] = [
    makeEdge('trigger-1', 'classify-1'),
    makeEdge('classify-1', 'followup-1'),
    makeEdge('followup-1', 'vendor-1'),
    makeEdge('vendor-1', 'assign-1'),
    makeEdge('assign-1', 'notify-1'),
    makeEdge('notify-1', 'email-1'),
  ];

  return layoutWorkflow(nodes, edges);
}

export function getRentWorkflow() {
  const nodes: Node<WorkflowNodeData>[] = [
    makeNode('schedule-1', 'scheduleTrigger'),
    makeNode('lookup-1', 'leaseDataLookup'),
    makeNode('tone-1', 'toneCalibrate'),
    makeNode('email-r1', 'sendEmail', {
      label: 'Send Reminder',
      description: 'Send rent reminder email',
    }),
  ];

  const edges: Edge[] = [
    makeEdge('schedule-1', 'lookup-1'),
    makeEdge('lookup-1', 'tone-1'),
    makeEdge('tone-1', 'email-r1'),
  ];

  return layoutWorkflow(nodes, edges);
}

export function getInquiryWorkflow() {
  const nodes: Node<WorkflowNodeData>[] = [
    makeNode('trigger-q1', 'tenantMessage', {
      description: 'Tenant asks a lease/policy question',
    }),
    makeNode('lookup-q1', 'leaseDataLookup'),
    makeNode('answer-q1', 'answerInquiry'),
    makeNode('email-q1', 'sendEmail', {
      label: 'Send Response',
      description: 'Send AI-generated answer',
    }),
  ];

  const edges: Edge[] = [
    makeEdge('trigger-q1', 'lookup-q1'),
    makeEdge('lookup-q1', 'answer-q1'),
    makeEdge('answer-q1', 'email-q1'),
  ];

  return layoutWorkflow(nodes, edges);
}

export const WORKFLOW_TEMPLATES = [
  { id: 'triage', name: 'Maintenance Triage', getWorkflow: getTriageWorkflow },
  { id: 'rent', name: 'Rent Reminders', getWorkflow: getRentWorkflow },
  { id: 'inquiry', name: 'Tenant Inquiries', getWorkflow: getInquiryWorkflow },
] as const;
