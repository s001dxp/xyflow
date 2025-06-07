<template>
  <div class="interaction-example">
    <VueFlow
      v-model:nodes="nodes"
      v-model:edges="edges"
      :fit-view-on-init="true"
      :pan-on-drag="panOnDrag"
      :zoom-on-scroll="zoomOnScroll"
      :pan-on-scroll="panOnScroll"
      :selection-on-drag="selectionOnDrag"
      :zoom-on-pinch="zoomOnPinch"
      :pan-on-scroll-mode="panOnScrollMode"
      :zoom-on-double-click="zoomOnDoubleClick"
      @connect="onConnect"
      @node-click="onNodeClick"
      @node-double-click="onNodeDoubleClick"
      @node-context-menu="onNodeContextMenu"
      @edge-click="onEdgeClick"
      @edge-double-click="onEdgeDoubleClick"
      @edge-context-menu="onEdgeContextMenu"
      @pane-click="onPaneClick"
      @pane-context-menu="onPaneContextMenu"
      @selection-change="onSelectionChange"
      @move-start="onMoveStart"
      @move="onMove"
      @move-end="onMoveEnd"
    >
      <Background pattern="dots" />
      <Controls />
      <Panel position="top-left" class="controls-panel">
        <div>
          <h3>Interaction Settings</h3>
          
          <div class="control-group">
            <label>
              <input type="checkbox" v-model="panOnDrag" />
              Pan on drag
            </label>
            <label>
              <input type="checkbox" v-model="zoomOnScroll" />
              Zoom on scroll
            </label>
            <label>
              <input type="checkbox" v-model="panOnScroll" />
              Pan on scroll
            </label>
            <label>
              <input type="checkbox" v-model="selectionOnDrag" />
              Selection on drag
            </label>
            <label>
              <input type="checkbox" v-model="zoomOnPinch" />
              Zoom on pinch
            </label>
            <label>
              <input type="checkbox" v-model="zoomOnDoubleClick" />
              Zoom on double click
            </label>
          </div>

          <div class="control-group">
            <label>Pan on scroll mode:</label>
            <select v-model="panOnScrollMode">
              <option value="free">Free</option>
              <option value="vertical">Vertical</option>
              <option value="horizontal">Horizontal</option>
            </select>
          </div>
        </div>
      </Panel>
      
      <Panel position="top-right" class="events-panel">
        <div>
          <h3>Events Log</h3>
          <div class="events-log">
            <div 
              v-for="(event, index) in events" 
              :key="index" 
              class="event-item"
              :class="event.type"
            >
              <span class="event-time">{{ event.time }}</span>
              <span class="event-message">{{ event.message }}</span>
            </div>
          </div>
          <button @click="clearEvents" class="clear-btn">Clear Events</button>
        </div>
      </Panel>
    </VueFlow>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  VueFlow,
  Background,
  Controls,
  Panel,
  type Node,
  type Edge,
  type Connection,
  type PanOnScrollMode,
} from '@xyflow/vue';

// CSS imports
import '@xyflow/vue/dist/base.css';
import '@xyflow/vue/dist/style.css';

// Interaction settings
const panOnDrag = ref(true);
const zoomOnScroll = ref(true);
const panOnScroll = ref(false);
const selectionOnDrag = ref(true);
const zoomOnPinch = ref(true);
const zoomOnDoubleClick = ref(true);
const panOnScrollMode = ref<PanOnScrollMode>('free');

// Event logging
interface EventLog {
  time: string;
  message: string;
  type: 'node' | 'edge' | 'pane' | 'viewport';
}

const events = ref<EventLog[]>([]);

const logEvent = (message: string, type: EventLog['type'] = 'pane') => {
  const time = new Date().toLocaleTimeString();
  events.value.unshift({ time, message, type });
  if (events.value.length > 50) {
    events.value = events.value.slice(0, 50);
  }
};

const clearEvents = () => {
  events.value = [];
};

// Initial nodes
const nodes = ref<Node[]>([
  {
    id: '1',
    type: 'input',
    position: { x: 200, y: 100 },
    data: { label: 'Click me!' },
  },
  {
    id: '2',
    type: 'default',
    position: { x: 400, y: 200 },
    data: { label: 'Double-click me!' },
  },
  {
    id: '3',
    type: 'output',
    position: { x: 300, y: 300 },
    data: { label: 'Right-click me!' },
  },
]);

// Initial edges
const edges = ref<Edge[]>([
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    label: 'Click me!',
  },
  {
    id: 'e2-3',
    source: '2',
    target: '3',
    label: 'Right-click me!',
    animated: true,
  },
]);

// Event handlers
const onConnect = (connection: Connection) => {
  const newEdge: Edge = {
    id: `e${connection.source}-${connection.target}`,
    source: connection.source!,
    target: connection.target!,
  };
  edges.value.push(newEdge);
  logEvent(`Connected ${connection.source} to ${connection.target}`, 'edge');
};

const onNodeClick = (event: MouseEvent, node: Node) => {
  logEvent(`Node clicked: ${node.data.label} (${node.id})`, 'node');
};

const onNodeDoubleClick = (event: MouseEvent, node: Node) => {
  logEvent(`Node double-clicked: ${node.data.label} (${node.id})`, 'node');
};

const onNodeContextMenu = (event: MouseEvent, node: Node) => {
  event.preventDefault();
  logEvent(`Node right-clicked: ${node.data.label} (${node.id})`, 'node');
};

const onEdgeClick = (event: MouseEvent, edge: Edge) => {
  logEvent(`Edge clicked: ${edge.id}`, 'edge');
};

const onEdgeDoubleClick = (event: MouseEvent, edge: Edge) => {
  logEvent(`Edge double-clicked: ${edge.id}`, 'edge');
};

const onEdgeContextMenu = (event: MouseEvent, edge: Edge) => {
  event.preventDefault();
  logEvent(`Edge right-clicked: ${edge.id}`, 'edge');
};

const onPaneClick = (event: MouseEvent) => {
  logEvent('Pane clicked', 'pane');
};

const onPaneContextMenu = (event: MouseEvent) => {
  event.preventDefault();
  logEvent('Pane right-clicked', 'pane');
};

const onSelectionChange = ({ nodes: selectedNodes, edges: selectedEdges }: { nodes: Node[], edges: Edge[] }) => {
  const nodeCount = selectedNodes.length;
  const edgeCount = selectedEdges.length;
  if (nodeCount > 0 || edgeCount > 0) {
    logEvent(`Selection: ${nodeCount} nodes, ${edgeCount} edges`, 'pane');
  }
};

const onMoveStart = () => {
  logEvent('Viewport move started', 'viewport');
};

const onMove = () => {
  // Don't log every move event to avoid spam
};

const onMoveEnd = () => {
  logEvent('Viewport move ended', 'viewport');
};
</script>

<style scoped>
.interaction-example {
  width: 100%;
  height: 100%;
}

.controls-panel,
.events-panel {
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-width: 250px;
  max-width: 300px;
}

.controls-panel h3,
.events-panel h3 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 14px;
}

.control-group {
  margin-bottom: 15px;
}

.control-group label {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 12px;
  cursor: pointer;
}

.control-group input[type="checkbox"] {
  margin-right: 8px;
}

.control-group select {
  width: 100%;
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 12px;
  margin-top: 4px;
}

.events-log {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 8px;
  margin-bottom: 10px;
  background: #fafafa;
}

.event-item {
  font-size: 11px;
  margin-bottom: 4px;
  padding: 4px 6px;
  border-radius: 3px;
  display: flex;
  justify-content: space-between;
}

.event-item.node {
  background: #e3f2fd;
  border-left: 3px solid #2196f3;
}

.event-item.edge {
  background: #f3e5f5;
  border-left: 3px solid #9c27b0;
}

.event-item.pane {
  background: #e8f5e8;
  border-left: 3px solid #4caf50;
}

.event-item.viewport {
  background: #fff3e0;
  border-left: 3px solid #ff9800;
}

.event-time {
  color: #666;
  font-family: monospace;
  font-size: 10px;
}

.event-message {
  flex: 1;
  margin-left: 8px;
}

.clear-btn {
  width: 100%;
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 12px;
}

.clear-btn:hover {
  background: #f5f5f5;
  border-color: #bbb;
}
</style>
