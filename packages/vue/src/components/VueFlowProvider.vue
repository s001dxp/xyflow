<template>
  <div class="vue-flow-provider">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { provide } from 'vue';
import { VUE_FLOW_SYMBOL } from '../symbols';
import { createFlowStore } from '../store';
import type { Node, Edge, Viewport } from '../types';

interface VueFlowProviderProps {
  nodes?: Node[];
  edges?: Edge[];
  viewport?: Viewport;
}

const props = withDefaults(defineProps<VueFlowProviderProps>(), {
  nodes: () => [],
  edges: () => [],
  viewport: () => ({ x: 0, y: 0, zoom: 1 })
});

// Create store using the proper factory function
const store = createFlowStore({
  defaultNodes: props.nodes,
  defaultEdges: props.edges,
  defaultViewport: props.viewport
});

// Provide the store to child components
provide(VUE_FLOW_SYMBOL, store);
</script>

