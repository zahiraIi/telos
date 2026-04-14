'use client';

import { use, useEffect } from 'react';
import WorkflowCanvas from '@/components/canvas/WorkflowCanvas';
import { useWorkflowStore } from '@/stores/workflow-store';
import { WORKFLOW_TEMPLATES } from '@/lib/workflow/templates';

export default function WorkflowPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const setWorkflowName = useWorkflowStore((s) => s.setWorkflowName);

  const template = WORKFLOW_TEMPLATES.find((t) => t.id === id) ?? WORKFLOW_TEMPLATES[0];
  const { nodes, edges } = template.getWorkflow();

  useEffect(() => {
    setWorkflowName(template.name);
  }, [template.name, setWorkflowName]);

  return (
    <div className="h-screen">
      <WorkflowCanvas initialNodes={nodes} initialEdges={edges} />
    </div>
  );
}
