import { inject } from 'vue';
import { VUE_FLOW_SYMBOL } from '../symbols';
import type { Viewport, FitViewOptions, XYPosition } from '@xyflow/system';

export function useZoomPanHelper() {
  const store = inject(VUE_FLOW_SYMBOL);

  if (!store) {
    throw new Error(
      'The useZoomPanHelper composable must be used within a VueFlow component tree. ' +
      'Make sure you have wrapped your component with the VueFlow component.'
    );
  }

  /**
   * Set the current viewport
   * @param viewport The new viewport to set
   */
  const setViewport = (viewport: Viewport) => {
    store.setViewport(viewport);
  };

  /**
   * Fit the view to the elements in the flow
   * @param options Options to customize the fit view behavior
   */
  const fitView = (options?: FitViewOptions) => {
    store.fitView(options);
  };

  /**
   * Zoom in by a factor of 1.2
   * @param options Options to customize the zoom behavior
   */
  const zoomIn = (options?: { duration?: number }) => {
    store.zoomIn(options);
  };

  /**
   * Zoom out by a factor of 1.2
   * @param options Options to customize the zoom behavior
   */
  const zoomOut = (options?: { duration?: number }) => {
    store.zoomOut(options);
  };

  /**
   * Zoom to a specific level
   * @param zoomLevel The zoom level to set
   * @param options Options to customize the zoom behavior
   */
  const zoomTo = (zoomLevel: number, options?: { duration?: number }) => {
    store.zoomTo(zoomLevel, options);
  };

  /**
   * Get the current viewport
   * @returns The current viewport
   */
  const getViewport = () => store.getViewport();

  /**
   * Get the project function to convert from screen coordinates to flow coordinates
   */
  const project = (position: XYPosition): XYPosition => {
    const { x, y, zoom } = store.getViewport();
    return {
      x: (position.x - x) / zoom,
      y: (position.y - y) / zoom,
    };
  };

  return {
    setViewport,
    fitView,
    zoomIn,
    zoomOut,
    zoomTo,
    getViewport,
    project,
  };
}
