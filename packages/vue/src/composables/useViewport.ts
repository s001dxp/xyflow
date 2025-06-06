import { computed } from 'vue';
import { useVueFlow } from './useVueFlow';
import type { Viewport, FitViewOptions } from '../types';

export function useViewport() {
  const store = useVueFlow();

  const viewport = computed(() => store.viewport);

  const setViewport = (viewport: Viewport) => {
    store.setViewport(viewport);
  };

  const fitView = (options?: FitViewOptions) => {
    store.fitView(options);
  };

  const zoomIn = (options?: { duration?: number }) => {
    store.zoomIn(options);
  };

  const zoomOut = (options?: { duration?: number }) => {
    store.zoomOut(options);
  };

  const zoomTo = (zoomLevel: number, options?: { duration?: number }) => {
    store.zoomTo(zoomLevel, options);
  };

  const getViewport = () => store.getViewport();

  return {
    viewport,
    setViewport,
    fitView,
    zoomIn,
    zoomOut,
    zoomTo,
    getViewport,
  };
}
