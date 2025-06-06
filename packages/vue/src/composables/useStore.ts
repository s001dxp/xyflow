import { inject, computed, ref, watchEffect } from 'vue';
import { VUE_FLOW_SYMBOL } from '../symbols';
import type { FlowStore } from '../store';

/**
 * Composable for accessing store with selector pattern for performance optimization
 * This is the Vue equivalent of React's useStore hook
 */
export function useStore(): FlowStore;
export function useStore<T>(
  selector: (state: FlowStore) => T,
  equalityFn?: (a: T, b: T) => boolean
): T;
export function useStore<T = any>(
  selector?: (state: FlowStore) => T,
  equalityFn?: (a: T, b: T) => boolean
): FlowStore | T {
  const store = inject(VUE_FLOW_SYMBOL);
  
  if (!store) {
    throw new Error('useStore must be used within a VueFlow component');
  }
  
  // If no selector is provided, return the entire store
  if (!selector) {
    return store as FlowStore;
  }
  
  // Create a computed that selects the required slice
  const selected = computed(() => {
    return selector(store as FlowStore);
  });
  
  return selected as T;
}

export function useStoreApi() {
  const store = inject(VUE_FLOW_SYMBOL);
  
  if (!store) {
    throw new Error('useStoreApi must be used within a VueFlow component');
  }
  
  // Return API methods similar to React's implementation
  return {
    getState: () => store as FlowStore,
    setState: (newState: Partial<FlowStore>) => {
      Object.assign(store, newState);
    },
    subscribe: (callback: (state: FlowStore) => void) => {
      // Vue's reactivity system handles this automatically
      // but we can provide a subscription-like interface
      const stopWatcher = watchEffect(() => {
        callback(store as FlowStore);
      });
      return stopWatcher;
    }
  };
}
