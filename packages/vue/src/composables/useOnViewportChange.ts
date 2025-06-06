import { inject, watchEffect, ref } from 'vue';
import { VUE_FLOW_SYMBOL } from '../symbols';
import type { Viewport, UseOnViewportChangeOptions } from '../types';

/**
 * Composable for listening to viewport changes
 * This is the Vue equivalent of React's useOnViewportChange hook
 */
export function useOnViewportChange(options?: UseOnViewportChangeOptions) {
  const store = inject(VUE_FLOW_SYMBOL);
  
  if (!store) {
    throw new Error('useOnViewportChange must be used within a VueFlow component');
  }
  
  if (options?.onChange) {
    watchEffect(() => {
      options.onChange!(store.viewport);
    });
  }
  
  return store.viewport;
}
