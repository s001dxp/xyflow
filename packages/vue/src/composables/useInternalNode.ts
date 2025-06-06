import { computed, inject } from 'vue';
import { VUE_FLOW_SYMBOL } from '../symbols';
import type { Node } from '../types';

/**
 * Composable for accessing internal node state
 * This is the Vue equivalent of React's useInternalNode hook
 */
export function useInternalNode(nodeId: string) {
  const store = inject(VUE_FLOW_SYMBOL);
  
  if (!store) {
    throw new Error('useInternalNode must be used within a VueFlow component');
  }
  
  const internalNode = computed(() => {
    const nodes = store.nodes as Node[];
    return nodes.find(node => node.id === nodeId);
  });
  
  return internalNode;
}
