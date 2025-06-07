<template>
  <div class="custom-node-example">
    <VueFlow
      ref="vueFlowRef"
      v-model:nodes="nodes"
      v-model:edges="edges"
      :node-types="nodeTypes"
      :fit-view-on-init="true"
      @connect="onConnect"
      @node:update="onUpdateNode"
    >
      <Background pattern="lines" />
      <Controls />
      <MiniMap />
      <Panel position="top-right" class="description">
        <div>
          <h3>Custom Node Example</h3>
          <p>
            This example shows how to create custom nodes in Vue Flow.
            Custom nodes can have interactive elements, custom styling, and dynamic data.
          </p>
          <div class="button-group">
            <button @click="addCustomNode">Add Custom Node</button>
            <button @click="addInteractiveNode">Add Interactive Node</button>
            <button @click="updateNodeData">Update Random Node</button>
          </div>
        </div>
      </Panel>
    </VueFlow>
  </div>
</template>

<script setup lang="ts">
import { ref, markRaw } from 'vue';
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
} from '@xyflow/vue';
import CustomNode from '../components/CustomNode.vue';
import InteractiveNode from '../components/InteractiveNode.vue';

// CSS imports
import '@xyflow/vue/dist/base.css';
import '@xyflow/vue/dist/style.css';

// Custom node types
const nodeTypes: NodeTypes = {
  custom: markRaw(CustomNode),
  interactive: markRaw(InteractiveNode),
};

// Initial nodes with custom types
const nodes = ref<Node[]>([
  {
    id: '1',
    type: 'custom',
    position: { x: 100, y: 100 },
    data: { 
      label: 'Custom Node 1',
      value: 42,
      color: '#ff6b6b'
    },
  },
  {
    id: '2',
    type: 'interactive',
    position: { x: 300, y: 200 },
    data: { 
      label: 'Interactive Node',
      clickCount: 0,
      status: 'idle'
    },
  },
  {
    id: '3',
    type: 'custom',
    position: { x: 500, y: 100 },
    data: { 
      label: 'Custom Node 2',
      value: 88,
      color: '#4ecdc4'
    },
  },
  {
    id: '4',
    type: 'default',
    position: { x: 300, y: 350 },
    data: { label: 'Default Node' },
  },
]);

// Initial edges
const edges = ref<Edge[]>([
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    type: 'smoothstep',
  },
  {
    id: 'e2-3',
    source: '2',
    target: '3',
    animated: true,
  },
  {
    id: 'e2-4',
    source: '2',
    target: '4',
    type: 'step',
  },
]);

// Vue Flow instance
const vueFlowRef = ref();

// Event handlers
const onConnect = (connection: Connection) => {
  const newEdge: Edge = {
    id: `e${connection.source}-${connection.target}`,
    source: connection.source!,
    target: connection.target!,
    type: 'default',
  };
  edges.value.push(newEdge);
};

// Handle custom node updates
const onUpdateNode = (nodeId: string, newData: any) => {
  const nodeIndex = nodes.value.findIndex(node => node.id === nodeId);
  if (nodeIndex !== -1) {
    nodes.value[nodeIndex] = {
      ...nodes.value[nodeIndex],
      data: newData,
    };
  }
};

// Button handlers
const addCustomNode = () => {
  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'];
  const newNode: Node = {
    id: `custom-${Date.now()}`,
    type: 'custom',
    position: vueFlowRef.value?.project({ x: Math.random() * 400, y: Math.random() * 300 }) || { x: Math.random() * 400, y: Math.random() * 300 },
    data: { 
      label: `Custom Node ${nodes.value.length + 1}`,
      value: Math.floor(Math.random() * 100),
      color: colors[Math.floor(Math.random() * colors.length)]
    },
  };
  nodes.value.push(newNode);
};

const addInteractiveNode = () => {
  const newNode: Node = {
    id: `interactive-${Date.now()}`,
    type: 'interactive',
    position: vueFlowRef.value?.project({ x: Math.random() * 400, y: Math.random() * 300 }) || { x: Math.random() * 400, y: Math.random() * 300 },
    data: { 
      label: `Interactive ${nodes.value.length + 1}`,
      clickCount: 0,
      status: 'idle'
    },
  };
  nodes.value.push(newNode);
};

const updateNodeData = () => {
  if (nodes.value.length > 0) {
    const randomIndex = Math.floor(Math.random() * nodes.value.length);
    const node = nodes.value[randomIndex];
    
    if (node.type === 'custom') {
      node.data.value = Math.floor(Math.random() * 100);
    } else if (node.type === 'interactive') {
      node.data.status = node.data.status === 'idle' ? 'active' : 'idle';
    }
  }
};
</script>

<style scoped>
.custom-node-example {
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
  flex-direction: column;
  gap: 8px;
}

.button-group button {
  padding: 8px 12px;
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
</style>
