import { computed, inject } from 'vue';
import { VUE_FLOW_SYMBOL } from '../symbols';
import type { Node } from '../types';

/**
 * Composable for getting data from multiple nodes
 * This is the Vue equivalent of React's useNodesData hook
 */
export function useNodesData<T extends Record<string, unknown> = Record<string, unknown>>(nodeIds: string[]) {
  const store = inject(VUE_FLOW_SYMBOL);
  
  if (!store) {
    throw new Error('useNodesData must be used within a VueFlow component');
  }
  
  const nodesData = computed(() => {
    const nodes = store.nodes as Node[];
    return nodeIds
      .map(id => nodes.find(node => node.id === id))
      .filter(Boolean)
      .map(node => node!.data) as T[];
  });
  
  return nodesData.value;
}

/**
 * Overloaded version for single node
 */
export function useNodeData<T extends Record<string, unknown> = Record<string, unknown>>(nodeId: string) {
  const store = inject(VUE_FLOW_SYMBOL);
  
  if (!store) {
    throw new Error('useNodeData must be used within a VueFlow component');
  }
  
  const nodeData = computed(() => {
    const nodes = store.nodes as Node[];
    const node = nodes.find(n => n.id === nodeId);
    return node?.data as T | undefined;
  });
  
  return nodeData.value;
}
