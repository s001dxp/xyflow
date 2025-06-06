// Main component
export { default as VueFlow } from './components/VueFlow.vue';

// Core components
export { default as Handle } from './components/Handle.vue';
export { default as Panel } from './components/Panel.vue';
export { default as EdgeLabelRenderer } from './components/EdgeLabelRenderer.vue';
export { default as ViewportPortal } from './components/ViewportPortal.vue';

// Edge components
export { default as EdgeText } from './components/EdgeText.vue';
export { default as StraightEdge } from './components/edges/StraightEdge.vue';
export { default as StepEdge } from './components/edges/StepEdge.vue';
export { default as BezierEdge } from './components/edges/BezierEdge.vue';
export { default as SimpleBezierEdge, getSimpleBezierPath } from './components/edges/SimpleBezierEdge.vue';
export { default as SmoothStepEdge } from './components/edges/SmoothStepEdge.vue';
export { default as BaseEdge } from './components/edges/BaseEdge.vue';

// Plugin components
export { Background } from './plugins/Background';
export { Controls } from './plugins/Controls';
export { MiniMap } from './plugins/MiniMap';
export { NodeResizer } from './plugins/NodeResizer';
export { NodeToolbar } from './plugins/NodeToolbar';

// Provider component
export { default as VueFlowProvider } from './components/VueFlowProvider.vue';

// Composables (Vue equivalent of React hooks)
export { useVueFlow } from './composables/useVueFlow';
export { useUpdateNodeInternals } from './composables/useUpdateNodeInternals';
export { useNodes } from './composables/useNodes';
export { useEdges } from './composables/useEdges';
export { useViewport } from './composables/useViewport';
export { useKeyPress } from './composables/useKeyPress';
export { useNodesState, useEdgesState } from './composables/useNodesEdgesState';
export { useStore, useStoreApi } from './composables/useStore';
export { useOnViewportChange } from './composables/useOnViewportChange';
export { useOnSelectionChange } from './composables/useOnSelectionChange';
export { useNodesInitialized } from './composables/useNodesInitialized';
export { useHandleConnections } from './composables/useHandleConnections';
export { useNodeConnections } from './composables/useNodeConnections';
export { useNodesData } from './composables/useNodesData';
export { useConnection } from './composables/useConnection';
export { useInternalNode } from './composables/useInternalNode';
export { useNodeId } from './composables/useNodeId';

// Utilities
export { applyNodeChanges, applyEdgeChanges } from './utils/changes';
export { isNode, isEdge } from './utils/general';

// Export all types
export * from './types';

// System types (re-exported from @xyflow/system)
export {
  type Align,
  type SmoothStepPathOptions,
  type BezierPathOptions,
  ConnectionLineType,
  type EdgeMarker,
  type EdgeMarkerType,
  MarkerType,
  type OnMove,
  type OnMoveStart,
  type OnMoveEnd,
  type Connection,
  ConnectionMode,
  type OnConnectStartParams,
  type OnConnectStart,
  type OnConnect,
  type OnConnectEnd,
  type Viewport,
  type SnapGrid,
  PanOnScrollMode,
  type ViewportHelperFunctionOptions,
  type SetCenterOptions,
  type FitBoundsOptions,
  type PanelPosition,
  type ProOptions,
  SelectionMode,
  type SelectionRect,
  type OnError,
  type NodeOrigin,
  type OnSelectionDrag,
  Position,
  type XYPosition,
  type XYZPosition,
  type Dimensions,
  type Rect,
  type Box,
  type Transform,
  type CoordinateExtent,
  type ColorMode,
  type ColorModeClass,
  type HandleType,
  type ShouldResize,
  type OnResizeStart,
  type OnResize,
  type OnResizeEnd,
  type ControlPosition,
  type ControlLinePosition,
  ResizeControlVariant,
  type ResizeParams,
  type ResizeParamsWithDirection,
  type ResizeDragEvent,
  type NodeChange,
  type NodeDimensionChange,
  type NodePositionChange,
  type NodeSelectionChange,
  type NodeRemoveChange,
  type NodeAddChange,
  type NodeReplaceChange,
  type EdgeChange,
  type EdgeSelectionChange,
  type EdgeRemoveChange,
  type EdgeAddChange,
  type EdgeReplaceChange,
  type KeyCode,
  type ConnectionState,
  type FinalConnectionState,
  type ConnectionInProgress,
  type NoConnection,
  type NodeConnection,
  type OnReconnect,
} from '@xyflow/system';

// System utils
export {
  type GetBezierPathParams,
  getBezierEdgeCenter,
  getBezierPath,
  getEdgeCenter,
  type GetSmoothStepPathParams,
  getSmoothStepPath,
  type GetStraightPathParams,
  getStraightPath,
  getViewportForBounds,
  getNodesBounds,
  getIncomers,
  getOutgoers,
  addEdge,
  reconnectEdge,
  getConnectedEdges,
} from '@xyflow/system';
