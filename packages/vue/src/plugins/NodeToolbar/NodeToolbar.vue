<template>
  <Teleport v-if="store && isActive && toolbarNodes.length > 0" :to="portalTarget">
    <div
      :class="[
        'vue-flow__node-toolbar',
        props.className
      ]"
      :style="wrapperStyle"
      :data-id="toolbarNodes.map(node => node.id).join(' ')"
    >
      <slot />
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import { Position, getNodeToolbarTransform, getInternalNodesBounds, type InternalNodeBase } from '@xyflow/system';

import { useStore } from '../../composables/useStore';
import type { FlowStore, Node } from '../../types';
import type { NodeToolbarProps } from './types';

// Props with defaults
const props = withDefaults(defineProps<NodeToolbarProps>(), {
  position: Position.Top,
  align: 'center',
  offset: 10,
});

// Context - get node id from parent node context if available
const contextNodeId = inject<string>('vue-flow__node_id', '');

// Store
const store = useStore();

// Computed portal target - should target the flow renderer like React/Svelte
const portalTarget = computed(() => {
  return store.domNode?.querySelector('.vue-flow__renderer') || 'body';
});

// Computed toolbar nodes
const toolbarNodes = computed<InternalNodeBase<Node>[]>(() => {
  const nodeIds = Array.isArray(props.nodeId) ? props.nodeId : [props.nodeId || contextNodeId || ''];
  
  return nodeIds.reduce<InternalNodeBase<Node>[]>((res, nodeId) => {
    const node = store.nodeLookup.get(nodeId);
    if (node) {
      res.push(node);
    }
    return res;
  }, []);
});

// Computed transform for positioning
const transform = computed(() => {
  if (toolbarNodes.value.length === 0) return '';
  
  const nodeRect = getInternalNodesBounds(new Map(toolbarNodes.value.map(node => [node.id, node])));
  if (!nodeRect) return '';
  
  return getNodeToolbarTransform(
    nodeRect,
    store.viewport,
    props.position,
    props.offset,
    props.align
  );
});

// Computed z-index
const zIndex = computed(() => {
  if (toolbarNodes.value.length === 0) return 1;
  return Math.max(...toolbarNodes.value.map(node => (node.internals.z || 0) + 1));
});

// Optimized selected nodes count - only compute when needed for visibility calculation
const selectedNodesCount = computed(() => {
  // Only compute if isVisible is not explicitly set
  if (typeof props.isVisible === 'boolean') {
    return 0; // Not needed
  }
  return store.nodes.filter(node => node.selected).length;
});

// Computed visibility
const isActive = computed(() => {
  if (typeof props.isVisible === 'boolean') {
    return props.isVisible;
  }
  
  // Default behavior: show toolbar only if its node is selected and no other node is selected
  return (
    toolbarNodes.value.length === 1 &&
    toolbarNodes.value[0].selected &&
    selectedNodesCount.value === 1
  );
});

// Computed wrapper style
const wrapperStyle = computed(() => {
  return {
    position: 'absolute' as const,
    transform: transform.value,
    zIndex: zIndex.value,
    pointerEvents: 'all' as const,
    ...props.style,
  };
});
</script>

<style>
.vue-flow__node-toolbar {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  padding: 4px;
  display: flex;
  gap: 4px;
  align-items: center;
}

.vue-flow__node-toolbar button {
  background: transparent;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.vue-flow__node-toolbar button:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}
</style>
