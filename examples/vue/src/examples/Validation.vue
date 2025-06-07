<template>
  <div class="validation-example">
    <VueFlow
      v-model:nodes="nodes"
      v-model:edges="edges"
      :fit-view-on-init="true"
      :is-valid-connection="isValidConnection"
      @connect="onConnect"
    >
      <Background pattern="dots" />
      <Controls />
      <Panel position="top-right" class="description">
        <div>
          <h3>Connection Validation</h3>
          <p>This example demonstrates connection validation rules:</p>
          <ul class="rules-list">
            <li>🟢 Input nodes can only have outgoing connections</li>
            <li>🔴 Output nodes can only have incoming connections</li>
            <li>🟡 Default nodes can have both</li>
            <li>❌ No self-connections allowed</li>
            <li>🔄 No duplicate connections allowed</li>
          </ul>
          <div class="stats">
            <span>Valid connections: {{ validConnections }}</span>
            <span>Invalid attempts: {{ invalidAttempts }}</span>
          </div>
        </div>
      </Panel>
    </VueFlow>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
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

// Stats
const validConnections = ref(0);
const invalidAttempts = ref(0);

// Initial nodes with different types
const nodes = ref<Node[]>([
  {
    id: '1',
    type: 'input',
    position: { x: 100, y: 100 },
    data: { label: 'Input 1\n(only outgoing)' },
    style: { background: '#e8f5e8', border: '2px solid #4caf50' },
  },
  {
    id: '2',
    type: 'input',
    position: { x: 100, y: 250 },
    data: { label: 'Input 2\n(only outgoing)' },
    style: { background: '#e8f5e8', border: '2px solid #4caf50' },
  },
  {
    id: '3',
    type: 'default',
    position: { x: 300, y: 100 },
    data: { label: 'Process 1\n(both directions)' },
    style: { background: '#fff3e0', border: '2px solid #ff9800' },
  },
  {
    id: '4',
    type: 'default',
    position: { x: 300, y: 250 },
    data: { label: 'Process 2\n(both directions)' },
    style: { background: '#fff3e0', border: '2px solid #ff9800' },
  },
  {
    id: '5',
    type: 'default',
    position: { x: 300, y: 400 },
    data: { label: 'Process 3\n(both directions)' },
    style: { background: '#fff3e0', border: '2px solid #ff9800' },
  },
  {
    id: '6',
    type: 'output',
    position: { x: 500, y: 175 },
    data: { label: 'Output 1\n(only incoming)' },
    style: { background: '#ffebee', border: '2px solid #f44336' },
  },
  {
    id: '7',
    type: 'output',
    position: { x: 500, y: 325 },
    data: { label: 'Output 2\n(only incoming)' },
    style: { background: '#ffebee', border: '2px solid #f44336' },
  },
]);

// Initial valid edges
const edges = ref<Edge[]>([
  {
    id: 'e1-3',
    source: '1',
    target: '3',
    style: { stroke: '#4caf50', strokeWidth: 2 },
  },
  {
    id: 'e3-6',
    source: '3',
    target: '6',
    style: { stroke: '#4caf50', strokeWidth: 2 },
  },
]);

// Get node by id
const getNode = (id: string) => nodes.value.find(node => node.id === id);

// Check if connection already exists
const connectionExists = (source: string, target: string) => {
  return edges.value.some(edge => 
    (edge.source === source && edge.target === target) ||
    (edge.source === target && edge.target === source)
  );
};

// Validation function
const isValidConnection = (connection: Connection): boolean => {
  const sourceNode = getNode(connection.source!);
  const targetNode = getNode(connection.target!);

  if (!sourceNode || !targetNode) {
    return false;
  }

  // Rule 1: No self-connections
  if (connection.source === connection.target) {
    console.log('❌ Self-connection not allowed');
    return false;
  }

  // Rule 2: No duplicate connections
  if (connectionExists(connection.source!, connection.target!)) {
    console.log('❌ Connection already exists');
    return false;
  }

  // Rule 3: Output nodes can only have incoming connections
  if (sourceNode.type === 'output') {
    console.log('❌ Output nodes cannot be source of connections');
    return false;
  }

  // Rule 4: Input nodes can only have outgoing connections
  if (targetNode.type === 'input') {
    console.log('❌ Input nodes cannot be target of connections');
    return false;
  }

  console.log('✅ Valid connection');
  return true;
};

// Connection handler
const onConnect = (connection: Connection) => {
  if (isValidConnection(connection)) {
    const newEdge: Edge = {
      id: `e${connection.source}-${connection.target}`,
      source: connection.source!,
      target: connection.target!,
      style: { stroke: '#4caf50', strokeWidth: 2 },
    };
    edges.value.push(newEdge);
    validConnections.value++;
  } else {
    invalidAttempts.value++;
    // You could show a toast notification here
    console.log('Connection attempt failed validation');
  }
};
</script>

<style scoped>
.validation-example {
  width: 100%;
  height: 100%;
}

.description {
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-width: 280px;
}

.description h3 {
  margin: 0 0 10px 0;
  color: #333;
}

.description p {
  margin: 0 0 10px 0;
  color: #666;
  line-height: 1.4;
}

.rules-list {
  margin: 0 0 15px 0;
  padding-left: 0;
  list-style: none;
  font-size: 12px;
}

.rules-list li {
  margin-bottom: 6px;
  padding: 4px 8px;
  background: #f8f9fa;
  border-radius: 4px;
  border-left: 3px solid #ddd;
}

.stats {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 12px;
  padding-top: 10px;
  border-top: 1px solid #eee;
}

.stats span {
  padding: 6px 10px;
  border-radius: 4px;
  font-weight: 500;
}

.stats span:first-child {
  background: #e8f5e8;
  color: #2e7d32;
}

.stats span:last-child {
  background: #ffebee;
  color: #c62828;
}

/* Custom node styles */
:global(.vue-flow .vue-flow__node) {
  text-align: center;
  font-size: 12px;
  font-weight: 500;
  white-space: pre-line;
}
</style>
