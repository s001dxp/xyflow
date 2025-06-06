// Re-export system types with proper Vue-specific adaptations
export * from '@xyflow/system';

// Import base types from system to extend
import type { 
  Connection as SystemConnection,
  Viewport as SystemViewport,
  FitViewOptionsBase,
  DefaultEdgeOptionsBase,
  OnConnect as SystemOnConnect,
  OnConnectStart as SystemOnConnectStart,
  OnConnectEnd as SystemOnConnectEnd,
  XYPosition,
  CoordinateExtent,
  NodeOrigin,
  NodeBase,
  EdgeBase,
  InternalNodeBase as SystemInternalNodeBase,
  NodeLookup,
  EdgeLookup,
  ConnectionLookup,
  Transform,
} from '@xyflow/system';

// Vue-specific type definitions extending the system types
export type Node<
  NodeData extends Record<string, unknown> = Record<string, unknown>,
  NodeType extends string | undefined = string | undefined
> = NodeBase<NodeData, NodeType> & {
  style?: Record<string, any>;
  class?: string | string[] | Record<string, boolean>;
  // Additional Vue-specific properties for compatibility
  parentNode?: string; // Alias for parentId
  dimensions?: { width: number; height: number };
};

export type Edge<
  EdgeData extends Record<string, unknown> = Record<string, unknown>,
  EdgeType extends string | undefined = string | undefined
> = EdgeBase<EdgeData, EdgeType> & {
  style?: Record<string, any>;
  class?: string | string[] | Record<string, boolean>;
  labelStyle?: Record<string, any>;
  labelShowBg?: boolean;
  labelBgStyle?: Record<string, any>;
  labelBgPadding?: number | [number, number];
  labelBgBorderRadius?: number;
  // Additional properties for compatibility
  label?: string;
};

// Create type alias for InternalNode that matches React/Svelte implementations
export type InternalNode<NodeType extends Node = Node> = SystemInternalNodeBase<NodeType>;
export type InternalNodeBase<NodeType extends Node = Node> = SystemInternalNodeBase<NodeType>;

// Use system types as base
export type Connection = SystemConnection;
export type Viewport = SystemViewport;
export type FitViewOptions<NodeType extends Node = Node> = FitViewOptionsBase<NodeType>;
export type DefaultEdgeOptions<EdgeType extends Edge = Edge> = DefaultEdgeOptionsBase<EdgeType>;
export type OnConnect = SystemOnConnect;
export type OnConnectStart = SystemOnConnectStart;
export type OnConnectEnd = SystemOnConnectEnd;

// Vue-specific component prop types
export interface HandleProps {
  type: 'source' | 'target';
  position: string;
  id?: string;
  style?: Record<string, any>;
  class?: string | string[] | Record<string, boolean>;
  isConnectable?: boolean;
  onConnect?: (params: Connection) => void;
}

export interface PanelProps {
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  class?: string | string[] | Record<string, boolean>;
  style?: Record<string, any>;
}

// Vue-specific event types
export interface NodeEventHandlers {
  onNodeClick?: (event: MouseEvent, node: Node) => void;
  onNodeDoubleClick?: (event: MouseEvent, node: Node) => void;
  onNodeMouseEnter?: (event: MouseEvent, node: Node) => void;
  onNodeMouseMove?: (event: MouseEvent, node: Node) => void;
  onNodeMouseLeave?: (event: MouseEvent, node: Node) => void;
  onNodeContextMenu?: (event: MouseEvent, node: Node) => void;
  onNodeDragStart?: (event: MouseEvent, node: Node) => void;
  onNodeDrag?: (event: MouseEvent, node: Node) => void;
  onNodeDragStop?: (event: MouseEvent, node: Node) => void;
}

export interface EdgeEventHandlers {
  onEdgeClick?: (event: MouseEvent, edge: Edge) => void;
  onEdgeDoubleClick?: (event: MouseEvent, edge: Edge) => void;
  onEdgeMouseEnter?: (event: MouseEvent, edge: Edge) => void;
  onEdgeMouseMove?: (event: MouseEvent, edge: Edge) => void;
  onEdgeMouseLeave?: (event: MouseEvent, edge: Edge) => void;
  onEdgeContextMenu?: (event: MouseEvent, edge: Edge) => void;
}

// Store types - for compatibility with components expecting VueFlowState
export interface VueFlowState {
  nodes: Node[];
  edges: Edge[];
  viewport: Viewport;
  selectedNodes: Node[];
  selectedEdges: Edge[];
  nodeTypes: Record<string, any>;
  edgeTypes: Record<string, any>;
  connectionMode: string;
  snapToGrid: boolean;
  snapGrid: [number, number];
  defaultEdgeOptions: DefaultEdgeOptions | null;
  
  // Internal store properties that match React/Svelte implementations
  nodeLookup: NodeLookup<InternalNode>;
  edgeLookup: EdgeLookup<Edge>;
  connectionLookup: ConnectionLookup;
  transform: Transform;
  width: number;
  height: number;
  domNode?: HTMLElement;
  rfId: string;
  panZoom?: any;
  translateExtent?: CoordinateExtent;
  boundingRect?: { x: number; y: number; width: number; height: number };
  viewBB?: { x: number; y: number; width: number; height: number };
  flowWidth?: number;
  flowHeight?: number;
}

// Hook options types
export interface UseOnViewportChangeOptions {
  onChange?: (viewport: Viewport) => void;
}

export interface UseOnSelectionChangeOptions {
  onChange?: (params: { nodes: Node[]; edges: Edge[] }) => void;
}

export interface UseNodesInitializedOptions {
  includeHiddenNodes?: boolean;
}

// Utility types for changes
export type NodeChange = 
  | { type: 'add'; item: Node }
  | { type: 'remove'; id: string }
  | { type: 'select'; id: string; selected: boolean }
  | { type: 'position'; id: string; position: { x: number; y: number } }
  | { type: 'dimensions'; id: string; dimensions: { width: number; height: number } };

export type EdgeChange = 
  | { type: 'add'; item: Edge }
  | { type: 'remove'; id: string }
  | { type: 'select'; id: string; selected: boolean };

// Vue Flow Instance type (similar to React Flow Instance)
export interface VueFlowInstance {
  getNodes: () => Node[];
  getEdges: () => Edge[];
  getNode: (id: string) => Node | undefined;
  getEdge: (id: string) => Edge | undefined;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  addNodes: (nodes: Node[]) => void;
  addEdges: (edges: Edge[]) => void;
  deleteElements: (elements: { nodes?: Node[]; edges?: Edge[] }) => void;
  getViewport: () => Viewport;
  setViewport: (viewport: Viewport) => void;
  fitView: (options?: FitViewOptions) => void;
  zoomIn: (options?: { duration?: number }) => void;
  zoomOut: (options?: { duration?: number }) => void;
  zoomTo: (zoomLevel: number, options?: { duration?: number }) => void;
  getIntersectingNodes: (node: Node | { id: string }) => Node[];
  isNodeIntersecting: (node: Node | { id: string }, area: { x: number; y: number; width: number; height: number }) => boolean;
}

// Re-export FlowStore from store module for components
export type { FlowStore } from '../store';
