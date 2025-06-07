<template>
  <div class="basic-flow-example">
    <VueFlow
      ref="vueFlowRef"
      v-model:nodes="nodes"
      v-model:edges="edges"
      @connect="onConnect"
      @nodeClick="onNodeClick"
      @edgeClick="onEdgeClick"
      @paneClick="onPaneClick"
    >
      <Background pattern="dots" />
      <Controls />
      <MiniMap />
      <Panel position="top-right" class="description">
        <div>
          <h3>Basic Flow Example</h3>
          <p>This is a basic example of the Vue Flow package.</p>
          <div class="buttonrow">
            <button @click="addNode">Add Node</button>
            <button @click="resetFlow">Reset</button>
          </div>
        </div>
      </Panel>
    </VueFlow>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import {
  VueFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
  type NodeChange,
  type EdgeChange,
  type Connection,
  type Node,
  type Edge
} from '@xyflow/vue';
import '@xyflow/vue/dist/base.css';
import '@xyflow/vue/dist/style.css';

// Initialize nodes and edges
const nodes = ref<Node[]>([
  {
    id: '1',
    type: 'default',
    position: { x: 250, y: 100 },
    data: { label: 'Node 1' }
  },
  {
    id: '2',
    type: 'default',
    position: { x: 100, y: 300 },
    data: { label: 'Node 2' }
  },
  {
    id: '3',
    type: 'default',
    position: { x: 400, y: 300 },
    data: { label: 'Node 3' }
  }
]);

const edges = ref<Edge[]>([
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    animated: true
  },
  {
    id: 'e1-3',
    source: '1',
    target: '3'
  }
]);

// Get flow instance for utilities
const vueFlowRef = ref();

// Connect nodes when user creates connections
const onConnect = (connection: Connection) => {
  const newEdge = {
    id: `e${connection.source}-${connection.target}`,
    source: connection.source,
    target: connection.target
  };
  edges.value = [...edges.value, newEdge];
};

// Handle node clicks
const onNodeClick = (event: any) => {
  console.log('Node clicked:', event.node.id);
};

// Handle edge clicks
const onEdgeClick = (event: any) => {
  console.log('Edge clicked:', event.edge.id);
};

// Handle pane clicks
const onPaneClick = () => {
  // Deselect any selected elements
};

// Generate node ID
let nodeId = 4;
const getId = () => `${nodeId++}`;

// Add a new node
const addNode = () => {
  const newNode = {
    id: getId(),
    type: 'default',
    position: {
      x: 200 + Math.random() * 200,
      y: 200 + Math.random() * 200,
    },
    data: {
      label: `Node ${nodeId - 1}`,
    },
  };
  nodes.value = [...nodes.value, newNode];
};

// Reset the flow to initial state
const resetFlow = () => {
  nodeId = 4;
  nodes.value = [
    { id: '1', type: 'default', position: { x: 250, y: 100 }, data: { label: 'Node 1' } },
    { id: '2', type: 'default', position: { x: 100, y: 300 }, data: { label: 'Node 2' } },
    { id: '3', type: 'default', position: { x: 400, y: 300 }, data: { label: 'Node 3' } }
  ];
  edges.value = [
    { id: 'e1-2', source: '1', target: '2', animated: true },
    { id: 'e1-3', source: '1', target: '3' }
  ];
};

// Fit view to flow elements on component mount
onMounted(() => {
  nextTick(() => {
    vueFlowRef.value?.fitView();
  });
});
</script>

<style>
.basic-flow-example {
  width: 100%;
  height: 100%;
}

.description {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
  max-width: 300px;
}

.buttonrow {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

button {
  padding: 8px 12px;
  background-color: #3288e5;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #1a6fc9;
}
</style>
