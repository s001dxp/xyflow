<template>
  <div class="edge-types-example">
    <VueFlow
      v-model:nodes="nodes"
      v-model:edges="edges"
      :edge-types="edgeTypes"
      :fit-view-on-init="true"
      @connect="onConnect"
    >
      <Background pattern="dots" />
      <Controls />
      <Panel position="top-right" class="description">
        <div>
          <h3>Edge Types Example</h3>
          <p>
            This example demonstrates different edge types available in Vue Flow.
          </p>
          <div class="edge-list">
            <div class="edge-item">
              <span class="edge-dot default"></span>
              Default Edge
            </div>
            <div class="edge-item">
              <span class="edge-dot smoothstep"></span>
              Smooth Step
            </div>
            <div class="edge-item">
              <span class="edge-dot step"></span>
              Step Edge
            </div>
            <div class="edge-item">
              <span class="edge-dot straight"></span>
              Straight Edge
            </div>
            <div class="edge-item">
              <span class="edge-dot custom"></span>
              Custom Edge
            </div>
          </div>
          <button @click="randomizeEdgeTypes">Randomize Edge Types</button>
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
  Panel,
  type Node,
  type Edge,
  type Connection,
  type EdgeTypes,
} from '@xyflow/vue';
import CustomEdge from '../components/CustomEdge.vue';

// CSS imports
import '@xyflow/vue/dist/base.css';
import '@xyflow/vue/dist/style.css';

// Edge types
const edgeTypes: EdgeTypes = {
  custom: markRaw(CustomEdge),
};

// Available edge type names
const edgeTypeNames = ['default', 'smoothstep', 'step', 'straight', 'custom'];

// Initial nodes in a grid layout
const nodes = ref<Node[]>([
  {
    id: '1',
    type: 'input',
    position: { x: 100, y: 100 },
    data: { label: 'Node 1' },
  },
  {
    id: '2',
    type: 'default',
    position: { x: 400, y: 100 },
    data: { label: 'Node 2' },
  },
  {
    id: '3',
    type: 'default',
    position: { x: 100, y: 200 },
    data: { label: 'Node 3' },
  },
  {
    id: '4',
    type: 'default',
    position: { x: 400, y: 200 },
    data: { label: 'Node 4' },
  },
  {
    id: '5',
    type: 'default',
    position: { x: 250, y: 300 },
    data: { label: 'Node 5' },
  },
  {
    id: '6',
    type: 'output',
    position: { x: 250, y: 400 },
    data: { label: 'Node 6' },
  },
]);

// Initial edges with different types
const edges = ref<Edge[]>([
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    type: 'default',
    label: 'default',
  },
  {
    id: 'e1-3',
    source: '1',
    target: '3',
    type: 'smoothstep',
    label: 'smoothstep',
  },
  {
    id: 'e2-4',
    source: '2',
    target: '4',
    type: 'step',
    label: 'step',
  },
  {
    id: 'e3-5',
    source: '3',
    target: '5',
    type: 'straight',
    label: 'straight',
    style: { stroke: '#ff6b6b', strokeWidth: 2 },
  },
  {
    id: 'e4-5',
    source: '4',
    target: '5',
    type: 'custom',
    label: 'custom',
    animated: true,
  },
  {
    id: 'e5-6',
    source: '5',
    target: '6',
    type: 'smoothstep',
    label: 'smoothstep animated',
    animated: true,
    style: { stroke: '#4ecdc4', strokeWidth: 3 },
  },
]);

// Event handlers
const onConnect = (connection: Connection) => {
  const randomType = edgeTypeNames[Math.floor(Math.random() * edgeTypeNames.length)];
  const newEdge: Edge = {
    id: `e${connection.source}-${connection.target}`,
    source: connection.source!,
    target: connection.target!,
    type: randomType,
    label: randomType,
    animated: Math.random() > 0.5,
  };
  edges.value.push(newEdge);
};

const randomizeEdgeTypes = () => {
  edges.value.forEach(edge => {
    const randomType = edgeTypeNames[Math.floor(Math.random() * edgeTypeNames.length)];
    edge.type = randomType;
    edge.label = randomType;
    edge.animated = Math.random() > 0.5;
    
    // Random colors for some edge types
    if (randomType === 'straight' || randomType === 'smoothstep') {
      const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'];
      edge.style = {
        stroke: colors[Math.floor(Math.random() * colors.length)],
        strokeWidth: Math.floor(Math.random() * 3) + 1,
      };
    }
  });
};
</script>

<style scoped>
.edge-types-example {
  width: 100%;
  height: 100%;
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

.edge-list {
  margin-bottom: 15px;
}

.edge-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 12px;
  color: #555;
}

.edge-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 8px;
  border: 2px solid;
}

.edge-dot.default {
  background: #b1b1b7;
  border-color: #b1b1b7;
}

.edge-dot.smoothstep {
  background: #4ecdc4;
  border-color: #4ecdc4;
}

.edge-dot.step {
  background: #45b7d1;
  border-color: #45b7d1;
}

.edge-dot.straight {
  background: #ff6b6b;
  border-color: #ff6b6b;
}

.edge-dot.custom {
  background: #feca57;
  border-color: #feca57;
}

button {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 12px;
  width: 100%;
}

button:hover {
  background: #f5f5f5;
  border-color: #bbb;
}
</style>
