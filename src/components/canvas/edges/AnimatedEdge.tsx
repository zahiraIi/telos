'use client';

import { memo } from 'react';
import {
  BaseEdge,
  getBezierPath,
  type EdgeProps,
} from '@xyflow/react';
import { useExecutionStore } from '@/stores/execution-store';

function AnimatedEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
  source,
}: EdgeProps) {
  const sourceStatus = useExecutionStore(
    (s) => s.nodeStatuses[source] ?? 'idle',
  );

  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  const isAnimating = sourceStatus === 'success';

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          ...style,
          stroke: isAnimating ? '#1baf75' : '#7c828d',
          strokeWidth: isAnimating ? 2 : 1.5,
          transition: 'stroke 0.3s, stroke-width 0.3s',
        }}
      />
      {isAnimating && (
        <circle r="4" fill="#1baf75" filter="url(#glow)">
          <animateMotion dur="0.8s" repeatCount="1" path={edgePath} />
        </circle>
      )}
    </>
  );
}

export default memo(AnimatedEdge);
