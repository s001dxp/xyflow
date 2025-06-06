import { inject } from 'vue';
import { VUE_FLOW_SYMBOL } from '../symbols';
import type { FlowStore } from '../store';

export function useVueFlow() {
  const store = inject(VUE_FLOW_SYMBOL);

  if (!store) {
    throw new Error(
      'The useVueFlow composable must be used within a VueFlow component tree. ' +
      'Make sure you have wrapped your component with the VueFlow component.'
    );
  }

  return store;
}

// Re-export types from our local types instead of @xyflow/system
export type {
  Node,
  Edge,
  Connection,
  ConnectionMode,
  Viewport,
  NodeChange,
  EdgeChange,
  OnConnect,
  OnConnectStart,
  OnConnectEnd,
  SelectionMode,
  PanOnScrollMode,
  ConnectionLineType,
  CoordinateExtent,
  NodeOrigin,
  DefaultEdgeOptions,
  FitViewOptions,
} from '../types';

// Export our store type
export type { FlowStore } from '../store';
