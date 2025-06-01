import { reactive, readonly } from 'vue';
import {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  XYPosition,
  Viewport,
  OnConnect,
  OnConnectStart,
  OnConnectEnd,
  ConnectionMode,
  FitViewOptions,
  DefaultEdgeOptions,
  CoordinateExtent,
  PanOnScrollMode,
  KeyCode,
  NodeOrigin,
  NodeDragHandler,
  NodeMouseHandler,
  SelectionDragHandler,
  SelectionMode,
  useKeyPress as useSystemKeyPress,
  OnMove
} from '@xyflow/system';

export interface FlowStore {
  nodes: Node[];
  edges: Edge[];
  viewport: Viewport;
  nodeTypes: Record<string, any>;
  edgeTypes: Record<string, any>;
  defaultEdgeOptions: DefaultEdgeOptions | null;
  connectionMode: ConnectionMode;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: OnConnect;
  addNodes: (nodes: Node[]) => void;
  addEdges: (edges: Edge[]) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  setViewport: (viewport: Viewport) => void;
  fitView: (options?: FitViewOptions) => void;
  zoomIn: (options?: { duration?: number }) => void;
  zoomOut: (options?: { duration?: number }) => void;
  zoomTo: (zoomLevel: number, options?: { duration?: number }) => void;
  getNodes: () => Node[];
  getEdges: () => Edge[];
  getViewport: () => Viewport;
  getNode: (id: string) => Node | undefined;
  getEdge: (id: string) => Edge | undefined;
  setDefaultEdgeOptions: (defaultEdgeOptions: DefaultEdgeOptions | null) => void;
}

export interface FlowStoreOptions {
  defaultNodes?: Node[];
  defaultEdges?: Edge[];
  defaultViewport?: Viewport;
  defaultNodeTypes?: Record<string, any>;
  defaultEdgeTypes?: Record<string, any>;
  defaultEdgeOptions?: DefaultEdgeOptions | null;
  connectionMode?: ConnectionMode;
}

export function createFlowStore(options: FlowStoreOptions = {}) {
  const {
    defaultNodes = [],
    defaultEdges = [],
    defaultViewport = { x: 0, y: 0, zoom: 1 },
    defaultNodeTypes = {},
    defaultEdgeTypes = {},
    defaultEdgeOptions = null,
    connectionMode = ConnectionMode.Strict
  } = options;

  const state = reactive({
    nodes: [...defaultNodes],
    edges: [...defaultEdges],
    viewport: { ...defaultViewport },
    nodeTypes: { ...defaultNodeTypes },
    edgeTypes: { ...defaultEdgeTypes },
    defaultEdgeOptions,
    connectionMode
  });

  // Methods to update state
  const onNodesChange = (changes: NodeChange[]) => {
    state.nodes = applyNodeChanges(changes, state.nodes);
  };

  const onEdgesChange = (changes: EdgeChange[]) => {
    state.edges = applyEdgeChanges(changes, state.edges);
  };

  const onConnect: OnConnect = (connection: Connection | Edge) => {
    state.edges = addEdge(connection, state.edges);
  };

  const addNodes = (nodesToAdd: Node[]) => {
    state.nodes = [...state.nodes, ...nodesToAdd];
  };

  const addEdges = (edgesToAdd: Edge[]) => {
    state.edges = [...state.edges, ...edgesToAdd];
  };

  const setNodes = (nodes: Node[]) => {
    state.nodes = nodes;
  };

  const setEdges = (edges: Edge[]) => {
    state.edges = edges;
  };

  const setViewport = (viewport: Viewport) => {
    state.viewport = viewport;
  };

  // Methods to get state
  const getNodes = () => state.nodes;
  const getEdges = () => state.edges;
  const getViewport = () => state.viewport;
  const getNode = (id: string) => state.nodes.find(node => node.id === id);
  const getEdge = (id: string) => state.edges.find(edge => edge.id === id);

  // Additional methods
  const fitView = (options?: FitViewOptions) => {
    // Implementation would depend on viewport transformation logic
    console.log('fitView', options);
  };

  const zoomIn = (options?: { duration?: number }) => {
    const zoom = Math.min(state.viewport.zoom * 1.2, 2);
    state.viewport = { ...state.viewport, zoom };
  };

  const zoomOut = (options?: { duration?: number }) => {
    const zoom = Math.max(state.viewport.zoom / 1.2, 0.5);
    state.viewport = { ...state.viewport, zoom };
  };

  const zoomTo = (zoomLevel: number, options?: { duration?: number }) => {
    state.viewport = { ...state.viewport, zoom: zoomLevel };
  };

  const setDefaultEdgeOptions = (options: DefaultEdgeOptions | null) => {
    state.defaultEdgeOptions = options;
  };

  const store: FlowStore = {
    // State
    nodes: state.nodes,
    edges: state.edges,
    viewport: state.viewport,
    nodeTypes: state.nodeTypes,
    edgeTypes: state.edgeTypes,
    defaultEdgeOptions: state.defaultEdgeOptions,
    connectionMode: state.connectionMode,

    // Methods
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNodes,
    addEdges,
    setNodes,
    setEdges,
    setViewport,
    fitView,
    zoomIn,
    zoomOut,
    zoomTo,
    getNodes,
    getEdges,
    getViewport,
    getNode,
    getEdge,
    setDefaultEdgeOptions,
  };

  return {
    state: readonly(state),
    ...store
  };
}
