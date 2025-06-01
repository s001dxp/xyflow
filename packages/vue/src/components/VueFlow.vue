<template>
  <div
    ref="flowWrapper"
    class="vue-flow"
    :class="[
      { 'vue-flow--nocursor': disableKeyboardA11y },
      { 'vue-flow--selectnode': selectionMode === SelectionMode.Partial }
    ]"
  >
    <div
      class="vue-flow__viewport"
      :style="viewportStyle"
      @wheel="onWheel"
      @mousemove="onMouseMove"
      @mousedown="onMouseDown"
      @click="onClick"
      @contextmenu="onContextMenu"
    >
      <TransitionGroup
        tag="div"
        class="vue-flow__nodes"
        name="vue-flow__node"
      >
        <Node
          v-for="node in nodes"
          :key="node.id"
          :id="node.id"
          :type="node.type"
          :data="node.data"
          :position="node.position"
          :style="node.style"
          :class="node.class"
          :selected="node.selected"
          :draggable="!node.draggable ? nodeDraggable : node.draggable"
          :selectable="!node.selectable ? nodeSelectable : node.selectable"
          :connectable="!node.connectable ? nodeConnectable : node.connectable"
          :deletable="!node.deletable ? nodeDeletable : node.deletable"
          :dimensions="getNodeDimensions(node)"
          :z-index="node.zIndex || 0"
          :is-hidden="!!node.hidden"
          :node-origin="nodeOrigin"
          :node-extent="nodeExtent"
          :drag-handle="nodeDragHandle"
          :parent-node="node.parentNode"
          :expand-parent="node.expandParent"
          @node-drag-start="onNodeDragStart"
          @node-drag="onNodeDrag"
          @node-drag-stop="onNodeDragStop"
          @node-mouse-enter="onNodeMouseEnter"
          @node-mouse-move="onNodeMouseMove"
          @node-mouse-leave="onNodeMouseLeave"
          @node-context-menu="onNodeContextMenu"
          @node-click="onNodeClick"
          @node-double-click="onNodeDoubleClick"
        />
      </TransitionGroup>

      <div class="vue-flow__edges">
        <template v-for="edge in edges" :key="edge.id">
          <component
            :is="getEdgeComponent(edge)"
            :id="edge.id"
            :source="edge.source"
            :target="edge.target"
            :type="edge.type"
            :data="edge.data"
            :style="edge.style"
            :class="edge.class"
            :source-handle="edge.sourceHandle"
            :target-handle="edge.targetHandle"
            :animated="edge.animated"
            :selected="edge.selected"
            :label="edge.label"
            :interacting="panningOrSelecting"
            :z-index="edge.zIndex || 0"
            :source-node="getNode(edge.source)"
            :target-node="getNode(edge.target)"
            :source-x="getSourcePosition(edge).x"
            :source-y="getSourcePosition(edge).y"
            :target-x="getTargetPosition(edge).x"
            :target-y="getTargetPosition(edge).y"
            :source-position="getSourcePosition(edge)"
            :target-position="getTargetPosition(edge)"
            @edge-click="onEdgeClick"
            @edge-context-menu="onEdgeContextMenu"
            @edge-mouse-enter="onEdgeMouseEnter"
            @edge-mouse-move="onEdgeMouseMove"
            @edge-mouse-leave="onEdgeMouseLeave"
            @edge-update-start="onEdgeUpdateStart"
            @edge-update="onEdgeUpdate"
            @edge-update-end="onEdgeUpdateEnd"
          />
        </template>
      </div>

      <ConnectionLine
        v-if="connectionLineVisible"
        :source-node="connectionLineSourceNode"
        :source-handle="connectionLineSourceHandle"
        :source-x="connectionLineSourceX"
        :source-y="connectionLineSourceY"
        :target-x="connectionLineTargetX"
        :target-y="connectionLineTargetY"
        :connection-position-x="connectionPositionX"
        :connection-position-y="connectionPositionY"
        :connection-line-type="connectionLineType"
        :connection-line-style="connectionLineStyle"
        :connection-status="connectionStatus"
      />

      <!-- Slot for user components that need to be panned/zoomed with the graph -->
      <slot></slot>
    </div>

    <!-- Fixed position UI components that don't pan/zoom with the graph -->
    <slot name="fixed"></slot>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, onUnmounted, provide, ref, watch } from 'vue';
import {
  ConnectionMode,
  SelectionMode,
  ConnectionLineType,
  NodeOrigin,
  PanOnScrollMode,
  Edge,
  Node,
  Viewport,
  Position,
  applyNodeChanges,
  applyEdgeChanges,
  XYPosition,
  isEdge,
  CoordinateExtent
} from '@xyflow/system';
import { createFlowStore, FlowStore } from '../store';
import Node from './Node.vue';
import ConnectionLine from './ConnectionLine.vue';
import { VUE_FLOW_SYMBOL } from '../symbols';

export default defineComponent({
  name: 'VueFlow',
  components: {
    Node,
    ConnectionLine
  },
  props: {
    id: {
      type: String,
      default: 'vue-flow-' + Math.random().toString(36).substr(2, 5)
    },
    nodes: {
      type: Array as () => Node[],
      default: () => []
    },
    edges: {
      type: Array as () => Edge[],
      default: () => []
    },
    nodeTypes: {
      type: Object,
      default: () => ({})
    },
    edgeTypes: {
      type: Object,
      default: () => ({})
    },
    defaultViewport: {
      type: Object as () => Viewport,
      default: () => ({ x: 0, y: 0, zoom: 1 })
    },
    minZoom: {
      type: Number,
      default: 0.5
    },
    maxZoom: {
      type: Number,
      default: 2
    },
    selectionMode: {
      type: String as () => SelectionMode,
      default: SelectionMode.Full
    },
    connectionMode: {
      type: String as () => ConnectionMode,
      default: ConnectionMode.Strict
    },
    connectionLineType: {
      type: String as () => ConnectionLineType,
      default: ConnectionLineType.Bezier
    },
    connectionLineStyle: {
      type: Object,
      default: () => ({})
    },
    defaultEdgeOptions: {
      type: Object,
      default: null
    },
    snapToGrid: {
      type: Boolean,
      default: false
    },
    snapGrid: {
      type: Array as () => [number, number],
      default: () => [15, 15]
    },
    panOnScroll: {
      type: Boolean,
      default: false
    },
    panOnScrollMode: {
      type: String as () => PanOnScrollMode,
      default: PanOnScrollMode.Free
    },
    panOnScrollSpeed: {
      type: Number,
      default: 0.5
    },
    panOnDrag: {
      type: Boolean,
      default: true
    },
    zoomOnScroll: {
      type: Boolean,
      default: true
    },
    zoomOnPinch: {
      type: Boolean,
      default: true
    },
    zoomOnDoubleClick: {
      type: Boolean,
      default: true
    },
    nodesConnectable: {
      type: Boolean,
      default: true
    },
    nodesDraggable: {
      type: Boolean,
      default: true
    },
    nodesSelectable: {
      type: Boolean,
      default: true
    },
    nodesDeletable: {
      type: Boolean,
      default: true
    },
    elementsSelectable: {
      type: Boolean,
      default: true
    },
    edgesUpdatable: {
      type: Boolean,
      default: true
    },
    edgesFocusable: {
      type: Boolean,
      default: true
    },
    edgesDraggable: {
      type: Boolean,
      default: true
    },
    elevateEdgesOnSelect: {
      type: Boolean,
      default: false
    },
    elevateNodesOnSelect: {
      type: Boolean,
      default: true
    },
    fitViewOnInit: {
      type: Boolean,
      default: false
    },
    connectOnClick: {
      type: Boolean,
      default: true
    },
    attributionPosition: {
      type: String as () => Position,
      default: Position.BottomRight
    },
    nodeExtent: {
      type: Array as () => CoordinateExtent,
      default: undefined
    },
    nodeOrigin: {
      type: Array as () => [number, number],
      default: () => [0, 0]
    },
    nodeDragHandle: {
      type: String,
      default: undefined
    },
    disableKeyboardA11y: {
      type: Boolean,
      default: false
    },
    autoPanOnConnect: {
      type: Boolean,
      default: true
    },
    autoPanOnNodeDrag: {
      type: Boolean,
      default: true
    }
  },
  setup(props, { emit }) {
    const flowWrapper = ref<HTMLDivElement | null>(null);
    const panningOrSelecting = ref(false);

    // Create the store with the provided props
    const store = createFlowStore({
      defaultNodes: props.nodes,
      defaultEdges: props.edges,
      defaultViewport: props.defaultViewport,
      defaultNodeTypes: props.nodeTypes,
      defaultEdgeTypes: props.edgeTypes,
      defaultEdgeOptions: props.defaultEdgeOptions,
      connectionMode: props.connectionMode
    });

    // Connection line state
    const connectionLineVisible = ref(false);
    const connectionLineSourceNode = ref<Node | null>(null);
    const connectionLineSourceHandle = ref<string | null>(null);
    const connectionLineSourceX = ref(0);
    const connectionLineSourceY = ref(0);
    const connectionLineTargetX = ref(0);
    const connectionLineTargetY = ref(0);
    const connectionPositionX = ref(0);
    const connectionPositionY = ref(0);
    const connectionStatus = ref('');

    // Computed styles for viewport
    const viewportStyle = computed(() => {
      const { x, y, zoom } = store.state.viewport;
      return {
        transform: `translate(${x}px, ${y}px) scale(${zoom})`,
      };
    });

    // Event handlers
    const onWheel = (event: WheelEvent) => {
      // Implement zoom/pan behavior based on props
    };

    const onMouseMove = (event: MouseEvent) => {
      // Handle mouse movement
    };

    const onMouseDown = (event: MouseEvent) => {
      // Handle mouse down
    };

    const onClick = (event: MouseEvent) => {
      // Handle click events
    };

    const onContextMenu = (event: MouseEvent) => {
      // Handle context menu
      emit('contextmenu', event);
    };

    // Node event handlers
    const onNodeDragStart = (event: any) => {
      emit('nodeDragStart', event);
    };

    const onNodeDrag = (event: any) => {
      emit('nodeDrag', event);
    };

    const onNodeDragStop = (event: any) => {
      emit('nodeDragStop', event);
    };

    const onNodeMouseEnter = (event: any) => {
      emit('nodeMouseEnter', event);
    };

    const onNodeMouseMove = (event: any) => {
      emit('nodeMouseMove', event);
    };

    const onNodeMouseLeave = (event: any) => {
      emit('nodeMouseLeave', event);
    };

    const onNodeContextMenu = (event: any) => {
      emit('nodeContextMenu', event);
    };

    const onNodeClick = (event: any) => {
      emit('nodeClick', event);
    };

    const onNodeDoubleClick = (event: any) => {
      emit('nodeDoubleClick', event);
    };

    // Edge event handlers
    const onEdgeClick = (event: any) => {
      emit('edgeClick', event);
    };

    const onEdgeContextMenu = (event: any) => {
      emit('edgeContextMenu', event);
    };

    const onEdgeMouseEnter = (event: any) => {
      emit('edgeMouseEnter', event);
    };

    const onEdgeMouseMove = (event: any) => {
      emit('edgeMouseMove', event);
    };

    const onEdgeMouseLeave = (event: any) => {
      emit('edgeMouseLeave', event);
    };

    const onEdgeUpdateStart = (event: any) => {
      emit('edgeUpdateStart', event);
    };

    const onEdgeUpdate = (event: any) => {
      emit('edgeUpdate', event);
    };

    const onEdgeUpdateEnd = (event: any) => {
      emit('edgeUpdateEnd', event);
    };

    // Helper functions
    const getNodeDimensions = (node: Node) => {
      // Get node dimensions
      return { width: 0, height: 0 };
    };

    const getEdgeComponent = (edge: Edge) => {
      // Return the appropriate edge component based on type
      return edge.type || 'default';
    };

    const getNode = (id: string) => {
      return store.getNode(id);
    };

    const getSourcePosition = (edge: Edge) => {
      // Calculate source position for the edge
      return { x: 0, y: 0 };
    };

    const getTargetPosition = (edge: Edge) => {
      // Calculate target position for the edge
      return { x: 0, y: 0 };
    };

    // Provide the store to child components
    provide(VUE_FLOW_SYMBOL, store);

    // Watch for prop changes
    watch(() => props.nodes, (newNodes) => {
      store.setNodes(newNodes);
    });

    watch(() => props.edges, (newEdges) => {
      store.setEdges(newEdges);
    });

    // Lifecycle hooks
    onMounted(() => {
      if (props.fitViewOnInit) {
        store.fitView();
      }
    });

    onUnmounted(() => {
      // Clean up any listeners
    });

    return {
      flowWrapper,
      panningOrSelecting,
      viewportStyle,
      connectionLineVisible,
      connectionLineSourceNode,
      connectionLineSourceHandle,
      connectionLineSourceX,
      connectionLineSourceY,
      connectionLineTargetX,
      connectionLineTargetY,
      connectionPositionX,
      connectionPositionY,
      connectionStatus,
      onWheel,
      onMouseMove,
      onMouseDown,
      onClick,
      onContextMenu,
      onNodeDragStart,
      onNodeDrag,
      onNodeDragStop,
      onNodeMouseEnter,
      onNodeMouseMove,
      onNodeMouseLeave,
      onNodeContextMenu,
      onNodeClick,
      onNodeDoubleClick,
      onEdgeClick,
      onEdgeContextMenu,
      onEdgeMouseEnter,
      onEdgeMouseMove,
      onEdgeMouseLeave,
      onEdgeUpdateStart,
      onEdgeUpdate,
      onEdgeUpdateEnd,
      getNodeDimensions,
      getEdgeComponent,
      getNode,
      getSourcePosition,
      getTargetPosition,
      ...store,
      store: store.state,
      SelectionMode,
    };
  }
});
</script>

<style>
.vue-flow {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
}

.vue-flow__viewport {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 0;
}

.vue-flow__nodes {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
}

.vue-flow__edges {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.vue-flow__node-enter-active,
.vue-flow__node-leave-active {
  transition: all 0.3s ease;
}

.vue-flow__node-enter-from,
.vue-flow__node-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>
