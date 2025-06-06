import { reactive, readonly, computed, toRaw, ref, shallowRef } from 'vue';
import {
  ConnectionMode,
  adoptUserNodes,
  updateConnectionLookup,
  initialConnection,
  infiniteExtent,
  type NodeLookup,
  type EdgeLookup,
  type ConnectionLookup,
  type ParentLookup,
  type ConnectionState,
  type Transform,
  type PanZoomInstance,
  type CoordinateExtent,
  type NodeOrigin,
  type SelectionRect,
  type SnapGrid,
  type Handle,
  type Viewport,
  type NodeChange as SystemNodeChange,
  type EdgeChange as SystemEdgeChange,
} from '@xyflow/system';
import { applyNodeChanges, applyEdgeChanges } from './utils/changes';
import {
  Node,
  Edge,
  InternalNode,
  Connection,
  OnConnect,
  NodeChange,
  EdgeChange,
  DefaultEdgeOptions,
  FitViewOptions,
} from './types';

// Main store interface that extends the reactive state with methods
export interface FlowStore<NodeType extends Node = Node, EdgeType extends Edge = Edge> {
  // Core properties
  rfId: string;
  width: number;
  height: number;
  transform: Transform;
  viewport: Viewport;
  
  // Node state
  nodes: NodeType[];
  nodesInitialized: boolean;
  nodeLookup: NodeLookup<InternalNode<NodeType>>;
  parentLookup: ParentLookup<InternalNode<NodeType>>;
  
  // Edge state
  edges: EdgeType[];
  edgeLookup: EdgeLookup<EdgeType>;
  connectionLookup: ConnectionLookup;
  
  // DOM and UI state
  domNode: HTMLDivElement | null;
  paneDragging: boolean;
  noPanClassName: string;
  
  // Pan/Zoom state
  panZoom: PanZoomInstance | null;
  minZoom: number;
  maxZoom: number;
  translateExtent: CoordinateExtent;
  nodeExtent: CoordinateExtent;
  nodeOrigin: NodeOrigin;
  nodeDragThreshold: number;
  
  // Selection state
  nodesSelectionActive: boolean;
  userSelectionActive: boolean;
  userSelectionRect: SelectionRect | null;
  
  // Connection state
  connection: ConnectionState<InternalNode<NodeType>>;
  isConnecting: boolean;
  connectionMode: ConnectionMode;
  connectionClickStartHandle: (Pick<Handle, 'nodeId' | 'id'> & Required<Pick<Handle, 'type'>>) | null;
  
  // Grid and snap state
  snapToGrid: boolean;
  snapGrid: SnapGrid;
  
  // Behavior flags
  nodesDraggable: boolean;
  nodesConnectable: boolean;
  nodesFocusable: boolean;
  edgesFocusable: boolean;
  edgesReconnectable: boolean;
  elementsSelectable: boolean;
  elevateNodesOnSelect: boolean;
  elevateEdgesOnSelect: boolean;
  selectNodesOnDrag: boolean;
  multiSelectionActive: boolean;
  
  // Types and defaults
  nodeTypes: Record<string, any>;
  edgeTypes: Record<string, any>;
  defaultEdgeOptions: DefaultEdgeOptions | null;
  hasDefaultNodes: boolean;
  hasDefaultEdges: boolean;
  
  // Store methods
  setState: (partialState: Partial<FlowStore<NodeType, EdgeType>>) => void;
  getState: () => FlowStore<NodeType, EdgeType>;
  
  // Node/Edge manipulation
  addNodes: (nodes: NodeType[]) => void;
  addEdges: (edges: EdgeType[]) => void;
  setNodes: (nodes: NodeType[]) => void;
  setEdges: (edges: EdgeType[]) => void;
  
  // Change handlers
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: OnConnect;
  
  // Utility methods
  updateNodeData: (nodeId: string, dataUpdate: any) => void;
  updateNodeInternals: (nodeId: string | string[]) => void;
  fitView: (options?: FitViewOptions) => Promise<boolean>;
  
  // Viewport methods
  setViewport: (viewport: Viewport, options?: any) => Promise<boolean>;
  getViewport: () => Viewport;
  zoomIn: (options?: { duration?: number }) => Promise<boolean>;
  zoomOut: (options?: { duration?: number }) => Promise<boolean>;
  zoomTo: (zoomLevel: number, options?: { duration?: number }) => Promise<boolean>;
  
  // Computed selectors
  getNodes: () => NodeType[];
  getEdges: () => EdgeType[];
  getNode: (id: string) => NodeType | undefined;
  getEdge: (id: string) => EdgeType | undefined;
  getInternalNode: (id: string) => InternalNode<NodeType> | undefined;
}

export interface FlowStoreOptions<NodeType extends Node = Node, EdgeType extends Edge = Edge> {
  id?: string;
  defaultNodes?: NodeType[];
  defaultEdges?: EdgeType[];
  defaultNodeTypes?: Record<string, any>;
  defaultEdgeTypes?: Record<string, any>;
  defaultEdgeOptions?: DefaultEdgeOptions | null;
  defaultViewport?: Viewport;
  connectionMode?: ConnectionMode;
  elevateNodesOnSelect?: boolean;
  nodeOrigin?: NodeOrigin;
  nodeExtent?: CoordinateExtent;
  translateExtent?: CoordinateExtent;
  minZoom?: number;
  maxZoom?: number;
  snapToGrid?: boolean;
  snapGrid?: SnapGrid;
  onConnect?: OnConnect;
}

let storeId = 0;

export function createFlowStore<NodeType extends Node = Node, EdgeType extends Edge = Edge>(
  options: FlowStoreOptions<NodeType, EdgeType> = {}
): FlowStore<NodeType, EdgeType> {
  const {
    id = `xyflow-${storeId++}`,
    defaultNodes = [],
    defaultEdges = [],
    defaultNodeTypes = {},
    defaultEdgeTypes = {},
    defaultEdgeOptions = null,
    connectionMode = ConnectionMode.Strict,
    elevateNodesOnSelect = true,
    nodeOrigin = [0, 0] as NodeOrigin,
    nodeExtent = infiniteExtent,
    translateExtent = infiniteExtent,
    minZoom = 0.5,
    maxZoom = 2,
    snapToGrid = false,
    snapGrid = [15, 15] as SnapGrid,
    onConnect = () => {},
  } = options;

  // Create reactive state for Vue-managed data
  const state = reactive({
    rfId: id,
    width: 0,
    height: 0,
    transform: [0, 0, 1] as Transform,
    
    // Reactive node and edge arrays
    nodes: shallowRef([...defaultNodes]),
    edges: shallowRef([...defaultEdges]),
    nodesInitialized: false,
    
    // DOM and UI state
    domNode: null as HTMLDivElement | null,
    paneDragging: false,
    noPanClassName: 'nopan',
    
    // Pan/Zoom state
    panZoom: null as PanZoomInstance | null,
    minZoom,
    maxZoom,
    translateExtent,
    nodeExtent,
    nodeOrigin,
    nodeDragThreshold: 1,
    
    // Selection state
    nodesSelectionActive: false,
    userSelectionActive: false,
    userSelectionRect: null as SelectionRect | null,
    
    // Connection state
    connectionMode,
    connectionClickStartHandle: null as (Pick<Handle, 'nodeId' | 'id'> & Required<Pick<Handle, 'type'>>) | null,
    
    // Grid and snap state
    snapToGrid,
    snapGrid,
    
    // Behavior flags
    nodesDraggable: true,
    nodesConnectable: true,
    nodesFocusable: true,
    edgesFocusable: true,
    edgesReconnectable: true,
    elementsSelectable: true,
    elevateNodesOnSelect,
    elevateEdgesOnSelect: false,
    selectNodesOnDrag: true,
    multiSelectionActive: false,
    
    // Types and defaults
    nodeTypes: { ...defaultNodeTypes },
    edgeTypes: { ...defaultEdgeTypes },
    defaultEdgeOptions,
    hasDefaultNodes: defaultNodes.length > 0,
    hasDefaultEdges: defaultEdges.length > 0,
  });

  // System lookups (non-reactive Maps for performance)
  const nodeLookup = shallowRef<NodeLookup<InternalNode<NodeType>>>(new Map());
  const parentLookup = shallowRef<ParentLookup<InternalNode<NodeType>>>(new Map());
  const edgeLookup = shallowRef<EdgeLookup<EdgeType>>(new Map());
  const connectionLookup = shallowRef<ConnectionLookup>(new Map());
  const connection = shallowRef<ConnectionState<InternalNode<NodeType>>>(initialConnection as ConnectionState<InternalNode<NodeType>>);

  // Helper functions to update system state
  const updateInternalNodes = (nodes: NodeType[]) => {
    const nodesInitialized = adoptUserNodes(
      toRaw(nodes),
      toRaw(nodeLookup.value),
      toRaw(parentLookup.value),
      {
        nodeOrigin: toRaw(state.nodeOrigin),
        nodeExtent: toRaw(state.nodeExtent),
        elevateNodesOnSelect: state.elevateNodesOnSelect,
        defaults: {},
      }
    );
    
    state.nodesInitialized = nodesInitialized;
  };

  const updateConnectionLookupFromEdges = (edges: EdgeType[]) => {
    updateConnectionLookup(toRaw(connectionLookup.value), toRaw(edgeLookup.value), toRaw(edges));
  };

  // Initialize system state with default data
  if (defaultNodes.length > 0) {
    updateInternalNodes(state.nodes);
  }
  if (defaultEdges.length > 0) {
    updateConnectionLookupFromEdges(state.edges);
  }

  // Computed properties
  const isConnecting = computed(() => connection.value.inProgress);

  // Store implementation
  const store: FlowStore<NodeType, EdgeType> = {
    // Reactive state getters
    get rfId() { return state.rfId; },
    get width() { return state.width; },
    get height() { return state.height; },
    get transform() { return state.transform; },
    get viewport() { 
      return {
        x: state.transform[0],
        y: state.transform[1],
        zoom: state.transform[2],
      };
    },
    
    get nodes() { return state.nodes; },
    get nodesInitialized() { return state.nodesInitialized; },
    get nodeLookup() { return nodeLookup.value; },
    get parentLookup() { return parentLookup.value; },
    
    get edges() { return state.edges; },
    get edgeLookup() { return edgeLookup.value; },
    get connectionLookup() { return connectionLookup.value; },
    
    get domNode() { return state.domNode; },
    get paneDragging() { return state.paneDragging; },
    get noPanClassName() { return state.noPanClassName; },
    
    get panZoom() { return state.panZoom; },
    get minZoom() { return state.minZoom; },
    get maxZoom() { return state.maxZoom; },
    get translateExtent() { return state.translateExtent; },
    get nodeExtent() { return state.nodeExtent; },
    get nodeOrigin() { return state.nodeOrigin; },
    get nodeDragThreshold() { return state.nodeDragThreshold; },
    
    get nodesSelectionActive() { return state.nodesSelectionActive; },
    get userSelectionActive() { return state.userSelectionActive; },
    get userSelectionRect() { return state.userSelectionRect; },
    
    get connection() { return connection.value; },
    get isConnecting() { return isConnecting.value; },
    get connectionMode() { return state.connectionMode; },
    get connectionClickStartHandle() { return state.connectionClickStartHandle; },
    
    get snapToGrid() { return state.snapToGrid; },
    get snapGrid() { return state.snapGrid; },
    
    get nodesDraggable() { return state.nodesDraggable; },
    get nodesConnectable() { return state.nodesConnectable; },
    get nodesFocusable() { return state.nodesFocusable; },
    get edgesFocusable() { return state.edgesFocusable; },
    get edgesReconnectable() { return state.edgesReconnectable; },
    get elementsSelectable() { return state.elementsSelectable; },
    get elevateNodesOnSelect() { return state.elevateNodesOnSelect; },
    get elevateEdgesOnSelect() { return state.elevateEdgesOnSelect; },
    get selectNodesOnDrag() { return state.selectNodesOnDrag; },
    get multiSelectionActive() { return state.multiSelectionActive; },
    
    get nodeTypes() { return state.nodeTypes; },
    get edgeTypes() { return state.edgeTypes; },
    get defaultEdgeOptions() { return state.defaultEdgeOptions; },
    get hasDefaultNodes() { return state.hasDefaultNodes; },
    get hasDefaultEdges() { return state.hasDefaultEdges; },

    // Core store methods
    setState(partialState: Partial<FlowStore<NodeType, EdgeType>>) {
      Object.assign(state, partialState);
    },
    
    getState() {
      return store;
    },

    // Node manipulation
    addNodes(newNodes: NodeType[]) {
      const updatedNodes = [...toRaw(state.nodes), ...newNodes];
      state.nodes = updatedNodes;
      updateInternalNodes(updatedNodes);
    },
    
    setNodes(newNodes: NodeType[]) {
      state.nodes = newNodes;
      updateInternalNodes(newNodes);
    },

    // Edge manipulation
    addEdges(newEdges: EdgeType[]) {
      const updatedEdges = [...toRaw(state.edges), ...newEdges];
      state.edges = updatedEdges;
      updateConnectionLookupFromEdges(updatedEdges);
    },
    
    setEdges(newEdges: EdgeType[]) {
      state.edges = newEdges;
      updateConnectionLookupFromEdges(newEdges);
    },

    // Change handlers - properly implement using Vue utilities
    onNodesChange(changes: NodeChange[]) {
      // Apply changes using Vue utility
      const updatedNodes = applyNodeChanges(changes, toRaw(state.nodes));
      
      // Update state
      state.nodes = updatedNodes;
      updateInternalNodes(updatedNodes);
    },
    
    onEdgesChange(changes: EdgeChange[]) {
      // Apply changes using Vue utility
      const updatedEdges = applyEdgeChanges(changes, toRaw(state.edges));
      
      // Update state
      state.edges = updatedEdges;
      updateConnectionLookupFromEdges(updatedEdges);
    },
    
    onConnect,

    // Utility methods
    updateNodeData(nodeId: string, dataUpdate: any) {
      const nodeIndex = state.nodes.findIndex(node => node.id === nodeId);
      if (nodeIndex !== -1) {
        const updatedNodes = [...toRaw(state.nodes)];
        updatedNodes[nodeIndex] = {
          ...updatedNodes[nodeIndex],
          data: { ...state.nodes[nodeIndex].data, ...dataUpdate }
        };
        store.setNodes(updatedNodes);
      }
    },
    
    updateNodeInternals(nodeIds: string | string[]) {
      // TODO: Implement using system utilities
      const ids = Array.isArray(nodeIds) ? nodeIds : [nodeIds];
      console.log('updateNodeInternals called', ids);
      return false;
    },
    
    fitView(options?: FitViewOptions) {
      // TODO: Implement fitView using system utilities
      console.log('fitView called', options);
      return Promise.resolve(false);
    },
    
    // Viewport methods
    setViewport(viewport: Viewport, options?: any) {
      state.transform = [viewport.x, viewport.y, viewport.zoom];
      return Promise.resolve(true);
    },
    
    getViewport() {
      return {
        x: state.transform[0],
        y: state.transform[1],
        zoom: state.transform[2],
      };
    },
    
    zoomIn(options?: { duration?: number }) {
      const newZoom = Math.min(state.maxZoom, state.transform[2] * 1.2);
      state.transform = [state.transform[0], state.transform[1], newZoom];
      return Promise.resolve(true);
    },
    
    zoomOut(options?: { duration?: number }) {
      const newZoom = Math.max(state.minZoom, state.transform[2] / 1.2);
      state.transform = [state.transform[0], state.transform[1], newZoom];
      return Promise.resolve(true);
    },
    
    zoomTo(zoomLevel: number, options?: { duration?: number }) {
      const newZoom = Math.max(state.minZoom, Math.min(state.maxZoom, zoomLevel));
      state.transform = [state.transform[0], state.transform[1], newZoom];
      return Promise.resolve(true);
    },
    
    // Computed selectors
    getNodes: () => state.nodes,
    getEdges: () => state.edges,
    getNode: (id: string) => state.nodes.find(node => node.id === id),
    getEdge: (id: string) => state.edges.find(edge => edge.id === id),
    getInternalNode: (id: string) => nodeLookup.value.get(id),
  };

  return store;
}