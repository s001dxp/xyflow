import { inject, watchEffect } from 'vue';
import { VUE_FLOW_SYMBOL } from '../symbols';
import type { Node, Edge, UseOnSelectionChangeOptions } from '../types';

/**
 * Composable for listening to selection changes
 * This is the Vue equivalent of React's useOnSelectionChange hook
 */
export function useOnSelectionChange(options?: UseOnSelectionChangeOptions) {
  const store = inject(VUE_FLOW_SYMBOL);
  
  if (!store) {
    throw new Error('useOnSelectionChange must be used within a VueFlow component');
  }
  
  if (options?.onChange) {
    watchEffect(() => {
      const selectedNodes = store.nodes.filter((node: Node) => node.selected);
      const selectedEdges = store.edges.filter((edge: Edge) => edge.selected);
      
      options.onChange!({
        nodes: selectedNodes,
        edges: selectedEdges
      });
    });
  }
  
  return {
    selectedNodes: store.nodes.filter((node: Node) => node.selected),
    selectedEdges: store.edges.filter((edge: Edge) => edge.selected)
  };
}
