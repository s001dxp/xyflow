<template>
  <component
    v-if="node && !node.hidden && nodeHasDimensions(node)"
    :is="nodeComponent"
    :id="node.id"
    :x="x"
    :y="y"
    :width="width"
    :height="height"
    :style="node.style"
    :selected="!!node.selected"
    :className="nodeClassNameFunc(node)"
    :color="nodeColorFunc(node)"
    :borderRadius="nodeBorderRadius"
    :strokeColor="nodeStrokeColorFunc(node)"
    :strokeWidth="nodeStrokeWidth"
    :shapeRendering="shapeRendering"
    @click="onClick"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { getNodeDimensions, nodeHasDimensions } from '@xyflow/system';
import { shallow } from 'zustand/shallow';

import { useStore } from '../../composables/useStore';
import type { FlowStore, Node } from '../../types';
import type { GetMiniMapNodeAttribute, MiniMapNodeProps } from './types';

// Props
interface Props {
  id: string;
  nodeColorFunc: GetMiniMapNodeAttribute<Node>;
  nodeStrokeColorFunc: GetMiniMapNodeAttribute<Node>;
  nodeClassNameFunc: GetMiniMapNodeAttribute<Node>;
  nodeBorderRadius: number;
  nodeStrokeWidth?: number;
  nodeComponent: any;
  shapeRendering: string;
}

const props = defineProps<Props>();

// Emits
const emit = defineEmits<{
  click: [event: MouseEvent, nodeId: string];
}>();

// Store selector for this specific node
const nodeSelector = computed(() => (s: FlowStore) => {
  const nodeInternals = s.nodeLookup.get(props.id);
  if (!nodeInternals) {
    return { node: null, x: 0, y: 0, width: 0, height: 0 };
  }

  const node = nodeInternals.internals.userNode as Node;
  const { x, y } = nodeInternals.internals.positionAbsolute;
  const { width, height } = getNodeDimensions(node);

  return {
    node,
    x,
    y,
    width,
    height,
  };
});

const { node, x, y, width, height } = useStore(nodeSelector.value, shallow);

// Event handlers
const onClick = (event: MouseEvent) => {
  emit('click', event, props.id);
};
</script>
