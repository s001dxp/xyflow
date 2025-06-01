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

// Additional type exports for improved DX
export type {
  FlowStore,
  Node,
  Edge,
  Connection,
  ConnectionMode,
  Position,
  Viewport,
  NodeChange,
  EdgeChange,
  OnConnect,
  OnConnectStart,
  OnConnectEnd,
  OnNodeDragStart,
  OnNodeDrag,
  OnNodeDragStop,
  SelectionMode,
  PanOnScrollMode,
  KeyCode,
  NodeMouseHandler,
  NodeDragHandler,
  SelectionDragHandler,
  EdgeMouseHandler,
  ConnectionLineType,
  CoordinateExtent,
  NodeOrigin,
  DefaultEdgeOptions,
} from '@xyflow/system';
