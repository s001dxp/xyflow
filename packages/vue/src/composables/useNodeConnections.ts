import { computed, inject } from 'vue';
import { VUE_FLOW_SYMBOL } from '../symbols';
import type { Node, Edge } from '../types';

/**
 * Composable for getting connections for a specific node
 * This is the Vue equivalent of React's useNodeConnections hook
 */
export function useNodeConnections(nodeId: string) {
  const store = inject(VUE_FLOW_SYMBOL);
  
  if (!store) {
    throw new Error('useNodeConnections must be used within a VueFlow component');
  }
  
  const connections = computed(() => {
    const edges = store.edges as Edge[];
    return edges.filter(edge => edge.source === nodeId || edge.target === nodeId);
  });
  
  const sourceConnections = computed(() => {
    const edges = store.edges as Edge[];
    return edges.filter(edge => edge.source === nodeId);
  });
  
  const targetConnections = computed(() => {
    const edges = store.edges as Edge[];
    return edges.filter(edge => edge.target === nodeId);
  });
  
  return {
    connections,
    sourceConnections,
    targetConnections
  };
}
