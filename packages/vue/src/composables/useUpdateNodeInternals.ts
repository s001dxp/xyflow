import { inject } from 'vue';
import { VUE_FLOW_SYMBOL } from '../symbols';

/**
 * Composable for updating node internals
 * This is the Vue equivalent of React's useUpdateNodeInternals hook
 */
export function useUpdateNodeInternals() {
  const store = inject(VUE_FLOW_SYMBOL);
  
  if (!store) {
    throw new Error('useUpdateNodeInternals must be used within a VueFlow component');
  }
  
  return (nodeId: string) => {
    // Update node internals logic
    if (store.updateNodeInternals) {
      store.updateNodeInternals(nodeId);
    }
  };
}
