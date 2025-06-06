<template>
  <BaseEdge
    :id="id"
    :path="edgePath"
    :style="style"
    :selected="selected"
    :animated="animated"
    :marker-end="markerEnd"
    :marker-start="markerStart"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { getBezierPath, type GetBezierPathParams } from '@xyflow/system';
import BaseEdge from './BaseEdge.vue';
import type { CSSProperties } from 'vue';

interface SimpleBezierEdgeProps extends GetBezierPathParams {
  id: string;
  style?: CSSProperties;
  selected?: boolean;
  animated?: boolean;
  markerEnd?: string;
  markerStart?: string;
}

const props = withDefaults(defineProps<SimpleBezierEdgeProps>(), {
  selected: false,
  animated: false
});

const edgePath = computed(() => {
  const { sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition } = props;
  
  const [path] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition
  });
  
  return path;
});
</script>

<script lang="ts">
export default {
  name: 'SimpleBezierEdge'
};

// Export utility function
export { getBezierPath as getSimpleBezierPath } from '@xyflow/system';
</script>
