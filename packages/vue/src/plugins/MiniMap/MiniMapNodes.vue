<template>
  <g>
    <template v-for="nodeId in nodeIds" :key="nodeId">
      <MiniMapNodeWrapper
        :id="nodeId"
        :nodeColorFunc="nodeColorFunc"
        :nodeStrokeColorFunc="nodeStrokeColorFunc"
        :nodeClassNameFunc="nodeClassNameFunc"
        :nodeBorderRadius="nodeBorderRadius"
        :nodeStrokeWidth="nodeStrokeWidth"
        :nodeComponent="NodeComponent"
        :shapeRendering="shapeRendering"
        @click="onNodeClick"
      />
    </template>
  </g>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { getNodeDimensions, nodeHasDimensions } from '@xyflow/system';
import { shallow } from 'zustand/shallow';

import { useStore } from '../../composables/useStore';
import MiniMapNode from './MiniMapNode.vue';
import MiniMapNodeWrapper from './MiniMapNodeWrapper.vue';
import type { MiniMapNodesProps, GetMiniMapNodeAttribute } from './types';
import type { FlowStore, Node } from '../../types';

// Props with defaults
const props = withDefaults(defineProps<MiniMapNodesProps>(), {
  nodeStrokeColor: 'transparent',
  nodeColor: '#e2e2e2',
  nodeClassName: '',
  nodeBorderRadius: 5,
  nodeStrokeWidth: 2,
  nodeComponent: MiniMapNode,
});

// Emits
const emit = defineEmits<{
  nodeClick: [event: MouseEvent, nodeId: string];
}>();

// Store selectors
const selectorNodeIds = (s: FlowStore) => s.nodes.map((node) => node.id);

const nodeIds = useStore(selectorNodeIds, shallow);

// Utility functions
const getAttrFunction = <NodeType extends Node>(func: any): GetMiniMapNodeAttribute<NodeType> =>
  func instanceof Function ? func : () => func;

// Computed attribute functions
const nodeColorFunc = computed(() => getAttrFunction(props.nodeColor));
const nodeStrokeColorFunc = computed(() => getAttrFunction(props.nodeStrokeColor));
const nodeClassNameFunc = computed(() => getAttrFunction(props.nodeClassName));

// Browser detection for shape rendering
const shapeRendering = computed(() => {
  if (typeof window === 'undefined') return 'crispEdges';
  // @ts-expect-error - checking for Chrome browser
  return !!window.chrome ? 'crispEdges' : 'geometricPrecision';
});

// Use the passed component or default
const NodeComponent = computed(() => props.nodeComponent || MiniMapNode);

// Event handlers
const onNodeClick = (event: MouseEvent, nodeId: string) => {
  emit('nodeClick', event, nodeId);
};
</script>
