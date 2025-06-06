import { computed, inject } from 'vue';
import { VUE_FLOW_SYMBOL } from '../symbols';
import type { Node, UseNodesInitializedOptions } from '../types';

/**
 * Composable for checking if all nodes are initialized
 * This is the Vue equivalent of React's useNodesInitialized hook
 */
export function useNodesInitialized(options?: UseNodesInitializedOptions) {
  const store = inject(VUE_FLOW_SYMBOL);
  
  if (!store) {
    throw new Error('useNodesInitialized must be used within a VueFlow component');
  }
  
  const nodesInitialized = computed(() => {
    const nodes = store.nodes as Node[];
    const includeHidden = options?.includeHiddenNodes ?? false;
    
    if (nodes.length === 0) {
      return false;
    }
    
    return nodes
      .filter(node => includeHidden || !node.hidden)
      .every(node => node.dimensions && node.dimensions.width > 0 && node.dimensions.height > 0);
  });
  
  return nodesInitialized;
}
