import { inject, onUnmounted } from 'vue';
import { VUE_FLOW_SYMBOL } from '../symbols';
import type { Connection } from '../types';

/**
 * Composable for accessing the current connection state
 * This is the Vue equivalent of React's useConnection hook
 */
export function useConnection() {
  const store = inject(VUE_FLOW_SYMBOL);
  
  if (!store) {
    throw new Error('useConnection must be used within a VueFlow component');
  }
  
  // Return reactive connection state
  return {
    connection: store.connection,
    isConnecting: store.isConnecting
  };
}
