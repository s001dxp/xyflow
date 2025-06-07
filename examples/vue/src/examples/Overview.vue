<template>
  <div class="overview-example">
    <VueFlow
      ref="vueFlowRef"
      v-model:nodes="nodes"
      v-model:edges="edges"
      :node-types="nodeTypes"
      :edge-types="edgeTypes"
      :fit-view-on-init="true"
      :min-zoom="0.2"
      :max-zoom="4"
      @connect="onConnect"
      @node-click="onNodeClick"
      @edge-click="onEdgeClick"
      @pane-click="onPaneClick"
      @selection-change="onSelectionChange"
    >
      <Background pattern="dots" />
      <Controls />
      <MiniMap />
      <Panel position="top-right" class="description">
        <div>
          <h3>Vue Flow Overview</h3>
          <p>
            This example demonstrates various features of Vue Flow including
            custom nodes, custom edges, controls, minimap, and more.
          </p>
          <div class="button-group">
            <button @click="updatePos" title="Update node positions">📍 Update Pos</button>
            <button @click="logToObject" title="Log flow object">💾 Log Object</button>
            <button @click="resetTransform" title="Reset transform">🔄 Reset Transform</button>
            <button @click="toggleClass" title="Toggle node classes">🎨 Toggle Classes</button>
          </div>
          <div class="button-group">
            <button @click="addNode">Add Node</button>
            <button @click="deleteNodes">Delete Selected</button>
            <button @click="hideUnhide">Toggle Hidden Node</button>
            <button @click="addEdge">Add Edge</button>
          </div>
        </div>
      </Panel>
    </VueFlow>
  </div>
</template>

<script setup lang="ts">
import { ref, markRaw, nextTick } from 'vue';
import {
  VueFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
  type Node,
  type Edge,
  type Connection,
  type NodeTypes,
  type EdgeTypes,
} from '@xyflow/vue';
import CustomNode from '../components/CustomNode.vue';
import CustomEdge from '../components/CustomEdge.vue';

// CSS imports
import '@xyflow/vue/dist/base.css';
import '@xyflow/vue/dist/style.css';

// Custom node and edge types
const nodeTypes: NodeTypes = {
  custom: markRaw(CustomNode),
};

const edgeTypes: EdgeTypes = {
  custom: markRaw(CustomEdge),
};

// Initial nodes
const nodes = ref<Node[]>([
  {
    id: '1',
    type: 'input',
    position: { x: 250, y: 100 },
    data: { label: 'Input Node' },
  },
  {
    id: '2',
    type: 'default',
    position: { x: 400, y: 200 },
    data: { label: 'Default Node' },
  },
  {
    id: '3',
    type: 'custom',
    position: { x: 250, y: 300 },
    data: { label: 'Custom Node', value: 42 },
  },
  {
    id: '4',
    type: 'output',
    position: { x: 550, y: 300 },
    data: { label: 'Output Node' },
  },
  {
    id: '5',
    type: 'default',
    position: { x: 100, y: 400 },
    data: { label: 'Hidden Node' },
    hidden: true,
  },
]);

// Initial edges
const edges = ref<Edge[]>([
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    animated: true,
  },
  {
    id: 'e2-3',
    source: '2',
    target: '3',
    type: 'custom',
  },
  {
    id: 'e3-4',
    source: '3',
    target: '4',
    type: 'smoothstep',
  },
]);

// Vue Flow instance ref
const vueFlowRef = ref();

// Event handlers
const onConnect = (connection: Connection) => {
  const newEdge: Edge = {
    id: `e${connection.source}-${connection.target}`,
    source: connection.source!,
    target: connection.target!,
  };
  edges.value.push(newEdge);
};

const onNodeClick = (event: MouseEvent, node: Node) => {
  console.log('Node clicked:', node.id, node);
};

const onEdgeClick = (event: MouseEvent, edge: Edge) => {
  console.log('Edge clicked:', edge.id, edge);
};

const onPaneClick = (event: MouseEvent) => {
  console.log('Pane clicked:', event);
};

const onSelectionChange = ({ nodes: selectedNodes, edges: selectedEdges }: { nodes: Node[], edges: Edge[] }) => {
  console.log('Selection changed:', selectedNodes, selectedEdges);
};

// Button handlers
const addNode = () => {
  const newNode: Node = {
    id: `node-${Date.now()}`,
    type: 'default',
    position: vueFlowRef.value?.project({ x: 300, y: 300 }) || { x: 300, y: 300 },
    data: { label: `New Node ${nodes.value.length + 1}` },
  };
  nodes.value.push(newNode);
};

const deleteNodes = () => {
  nodes.value = nodes.value.filter(node => !node.selected);
  edges.value = edges.value.filter(edge => !edge.selected);
};

const hideUnhide = () => {
  const hiddenNode = vueFlowRef.value?.findNode('5');
  if (hiddenNode) {
    hiddenNode.hidden = !hiddenNode.hidden;
  }
};

const addEdge = () => {
  if (nodes.value.length >= 2) {
    const sourceNode = nodes.value[Math.floor(Math.random() * nodes.value.length)];
    const targetNode = nodes.value[Math.floor(Math.random() * nodes.value.length)];
    
    if (sourceNode.id !== targetNode.id) {
      const newEdge: Edge = {
        id: `e${sourceNode.id}-${targetNode.id}-${Date.now()}`,
        source: sourceNode.id,
        target: targetNode.id,
        type: 'smoothstep',
      };
      edges.value.push(newEdge);
    }
  }
};

// Control handlers
const updatePos = () => {
  nodes.value.forEach((node) => {
    node.position = {
      x: Math.random() * 400,
      y: Math.random() * 400,
    };
  });
};

const logToObject = () => {
  console.log('Flow data:', {
    nodes: nodes.value,
    edges: edges.value,
    viewport: vueFlowRef.value?.viewport || { x: 0, y: 0, zoom: 1 },
  });
};

const resetTransform = () => {
  nextTick(() => vueFlowRef.value?.fitView());
};

const toggleClass = () => {
  nodes.value.forEach(node => {
    if (node.class) {
      delete node.class;
    } else {
      node.class = 'highlighted';
    }
  });
};
</script>

<style scoped>
.overview-example {
  width: 100%;
  height: 100%;
}

.description {
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-width: 250px;
}

.description h3 {
  margin: 0 0 10px 0;
  color: #333;
}

.description p {
  margin: 0 0 15px 0;
  color: #666;
  line-height: 1.4;
}

.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.button-group button {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 12px;
}

.button-group button:hover {
  background: #f5f5f5;
  border-color: #bbb;
}

:global(.vue-flow .vue-flow__node.highlighted) {
  background: #ffe066;
  border: 2px solid #ff6b6b;
}
</style>
