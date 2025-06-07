<template>
  <div class="dnd-example">
    <div class="dnd-container">
      <aside class="sidebar">
        <h3>Drag & Drop</h3>
        <p>Drag these nodes to the pane:</p>
        <div 
          v-for="nodeType in nodeTypes" 
          :key="nodeType.type"
          class="dnd-node"
          :style="{ backgroundColor: nodeType.color }"
          draggable="true"
          @dragstart="onDragStart($event, nodeType)"
        >
          {{ nodeType.label }}
        </div>
      </aside>
      
      <main class="flow-container">
        <VueFlow
          ref="vueFlowRef"
          v-model:nodes="nodes"
          v-model:edges="edges"
          :fit-view-on-init="true"
          @connect="onConnect"
          @drop="onDrop"
          @dragover="onDragOver"
        >
          <Background pattern="dots" />
          <Controls />
          <Panel position="top-right" class="description">
            <div>
              <h3>Drag & Drop Example</h3>
              <p>
                Drag nodes from the sidebar into the flow. 
                You can also connect nodes by dragging from the handles.
              </p>
              <div class="stats">
                <span>Nodes: {{ nodes.length }}</span>
                <span>Edges: {{ edges.length }}</span>
              </div>
            </div>
          </Panel>
        </VueFlow>
      </main>
    </div>
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
} from '@xyflow/vue';

// CSS imports
import '@xyflow/vue/dist/base.css';
import '@xyflow/vue/dist/style.css';

// Node types for dragging
const nodeTypes = [
  { type: 'input', label: 'Input Node', color: '#6ede87' },
  { type: 'default', label: 'Default Node', color: '#1a192b' },
  { type: 'output', label: 'Output Node', color: '#ff0072' },
];

// Vue Flow instance
const vueFlowRef = ref();

// Flow state
const nodes = ref<Node[]>([]);
const edges = ref<Edge[]>([]);

// Drag state
let draggedNodeType = ref<string | null>(null);
let nodeId = 0;

// Event handlers
const onConnect = (connection: Connection) => {
  const newEdge: Edge = {
    id: `e${connection.source}-${connection.target}`,
    source: connection.source!,
    target: connection.target!,
  };
  edges.value.push(newEdge);
};

const onDragStart = (event: DragEvent, nodeType: { type: string; label: string; color: string }) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData('application/vueflow', nodeType.type);
    event.dataTransfer.effectAllowed = 'move';
  }
  draggedNodeType.value = nodeType.type;
};

const onDragOver = (event: DragEvent) => {
  event.preventDefault();
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move';
  }
};

const onDrop = (event: DragEvent) => {
  event.preventDefault();
  
  const nodeType = event.dataTransfer?.getData('application/vueflow');
  
  if (nodeType) {
    const position = vueFlowRef.value?.project({
      x: event.clientX,
      y: event.clientY,
    }) || { x: event.clientX, y: event.clientY };

    const newNode: Node = {
      id: `dnd-${++nodeId}`,
      type: nodeType,
      position,
      data: { label: `${nodeType} node ${nodeId}` },
    };

    nodes.value.push(newNode);
  }
  
  draggedNodeType.value = null;
};
</script>

<style scoped>
.dnd-example {
  width: 100%;
  height: 100%;
}

.dnd-container {
  display: flex;
  height: 100%;
}

.sidebar {
  width: 200px;
  padding: 20px;
  background: #f8f9fa;
  border-right: 1px solid #e9ecef;
  display: flex;
  flex-direction: column;
}

.sidebar h3 {
  margin: 0 0 10px 0;
  color: #333;
}

.sidebar p {
  margin: 0 0 20px 0;
  color: #666;
  font-size: 14px;
}

.dnd-node {
  padding: 12px;
  margin-bottom: 10px;
  border-radius: 6px;
  color: white;
  font-weight: 500;
  cursor: grab;
  text-align: center;
  user-select: none;
  transition: transform 0.2s;
}

.dnd-node:hover {
  transform: translateY(-1px);
}

.dnd-node:active {
  cursor: grabbing;
  transform: scale(0.95);
}

.flow-container {
  flex: 1;
  position: relative;
}

.description {
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-width: 220px;
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

.stats {
  display: flex;
  gap: 15px;
  font-size: 12px;
  color: #888;
}

.stats span {
  padding: 4px 8px;
  background: #f5f5f5;
  border-radius: 4px;
}
</style>
