<template>
  <div class="color-mode-example" :class="{ dark: isDarkMode }">
    <VueFlow
      ref="vueFlowRef"
      v-model:nodes="nodes"
      v-model:edges="edges"
      :fit-view-on-init="true"
      @connect="onConnect"
    >
      <Background :pattern="backgroundPattern" />
      <Controls />
      <Panel position="top-right" class="controls-panel">
        <div>
          <h3>Color Mode Settings</h3>
          
          <div class="control-group">
            <label>
              <input 
                type="checkbox" 
                v-model="isDarkMode" 
                @change="toggleTheme"
              />
              Dark Mode
            </label>
          </div>

          <div class="control-group">
            <label>Background Pattern:</label>
            <select v-model="backgroundPattern">
              <option value="dots">Dots</option>
              <option value="lines">Lines</option>
              <option value="cross">Cross</option>
            </select>
          </div>

          <div class="control-group">
            <label>Color Scheme:</label>
            <select v-model="colorScheme" @change="updateColorScheme">
              <option value="default">Default</option>
              <option value="warm">Warm</option>
              <option value="cool">Cool</option>
              <option value="neon">Neon</option>
            </select>
          </div>

          <button @click="addNode" class="add-btn">Add Node</button>
        </div>
      </Panel>
    </VueFlow>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
  VueFlow,
  Background,
  Controls,
  Panel,
  type Node,
  type Edge,
  type Connection,
  type BackgroundVariant,
} from '@xyflow/vue';

// CSS imports
import '@xyflow/vue/dist/base.css';
import '@xyflow/vue/dist/style.css';

// Theme state
const isDarkMode = ref(false);
const backgroundPattern = ref<BackgroundVariant>('dots');
const colorScheme = ref('default');

// Vue Flow instance
const vueFlowRef = ref();

// Color schemes
const colorSchemes = {
  default: {
    light: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'],
    dark: ['#ff5252', '#26a69a', '#42a5f5', '#81c784', '#ffca28'],
  },
  warm: {
    light: ['#ff8a65', '#ffb74d', '#ff7043', '#f4511e', '#d84315'],
    dark: ['#ff6e40', '#ff9800', '#ff5722', '#e64a19', '#bf360c'],
  },
  cool: {
    light: ['#64b5f6', '#4fc3f7', '#4dd0e1', '#4db6ac', '#81c784'],
    dark: ['#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50'],
  },
  neon: {
    light: ['#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3'],
    dark: ['#f50057', '#e040fb', '#7c4dff', '#536dfe', '#448aff'],
  },
};

// Initial nodes
const nodes = ref<Node[]>([
  {
    id: '1',
    type: 'input',
    position: { x: 200, y: 100 },
    data: { label: 'Start' },
    style: getNodeStyle(0),
  },
  {
    id: '2',
    type: 'default',
    position: { x: 400, y: 200 },
    data: { label: 'Process' },
    style: getNodeStyle(1),
  },
  {
    id: '3',
    type: 'default',
    position: { x: 200, y: 300 },
    data: { label: 'Transform' },
    style: getNodeStyle(2),
  },
  {
    id: '4',
    type: 'output',
    position: { x: 400, y: 400 },
    data: { label: 'Result' },
    style: getNodeStyle(3),
  },
]);

// Initial edges
const edges = ref<Edge[]>([
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    animated: true,
    style: getEdgeStyle(),
  },
  {
    id: 'e2-3',
    source: '2',
    target: '3',
    type: 'smoothstep',
    style: getEdgeStyle(),
  },
  {
    id: 'e3-4',
    source: '3',
    target: '4',
    animated: true,
    style: getEdgeStyle(),
  },
]);

// Helper functions
function getNodeStyle(index: number) {
  const colors = colorSchemes[colorScheme.value as keyof typeof colorSchemes];
  const palette = isDarkMode.value ? colors.dark : colors.light;
  const color = palette[index % palette.length];
  
  return {
    background: color,
    color: 'white',
    border: isDarkMode.value ? '2px solid rgba(255,255,255,0.2)' : '2px solid rgba(0,0,0,0.1)',
    boxShadow: isDarkMode.value 
      ? '0 4px 8px rgba(0,0,0,0.5)' 
      : '0 4px 8px rgba(0,0,0,0.1)',
  };
}

function getEdgeStyle() {
  return {
    stroke: isDarkMode.value ? '#ffffff60' : '#00000060',
    strokeWidth: 2,
  };
}

// Event handlers
const onConnect = (connection: Connection) => {
  const newEdge: Edge = {
    id: `e${connection.source}-${connection.target}`,
    source: connection.source!,
    target: connection.target!,
    style: getEdgeStyle(),
  };
  edges.value.push(newEdge);
};

const toggleTheme = () => {
  updateColors();
  updateBodyClass();
};

const updateColorScheme = () => {
  updateColors();
};

const updateColors = () => {
  // Update node colors
  nodes.value.forEach((node, index) => {
    node.style = getNodeStyle(index);
  });
  
  // Update edge colors
  edges.value.forEach(edge => {
    edge.style = getEdgeStyle();
  });
};

const updateBodyClass = () => {
  if (isDarkMode.value) {
    document.body.classList.add('dark');
  } else {
    document.body.classList.remove('dark');
  }
};

const addNode = () => {
  const newNode: Node = {
    id: `node-${Date.now()}`,
    type: 'default',
    position: vueFlowRef.value?.project({ 
      x: Math.random() * 400 + 100, 
      y: Math.random() * 300 + 100 
    }) || { 
      x: Math.random() * 400 + 100, 
      y: Math.random() * 300 + 100 
    },
    data: { label: `Node ${nodes.value.length + 1}` },
    style: getNodeStyle(nodes.value.length),
  };
  
  nodes.value.push(newNode);
};

// Initialize theme
onMounted(() => {
  updateBodyClass();
});
</script>

<style scoped>
.color-mode-example {
  width: 100%;
  height: 100%;
  transition: background-color 0.3s ease;
}

.color-mode-example.dark {
  background: #1a1a1a;
}

.controls-panel {
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-width: 220px;
  transition: all 0.3s ease;
}

.dark .controls-panel {
  background: #2a2a2a;
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}

.controls-panel h3 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 14px;
}

.dark .controls-panel h3 {
  color: white;
}

.control-group {
  margin-bottom: 15px;
}

.control-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: 500;
  color: #555;
  cursor: pointer;
}

.dark .control-group label {
  color: #ccc;
}

.control-group input[type="checkbox"] {
  margin-right: 8px;
}

.control-group select {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  font-size: 12px;
  margin-top: 4px;
}

.dark .control-group select {
  background: #3a3a3a;
  border-color: #555;
  color: white;
}

.add-btn {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;
}

.add-btn:hover {
  background: #f5f5f5;
  border-color: #bbb;
}

.dark .add-btn {
  background: #3a3a3a;
  border-color: #555;
  color: white;
}

.dark .add-btn:hover {
  background: #4a4a4a;
  border-color: #777;
}

/* Global dark mode styles */
:global(.dark .vue-flow) {
  background: #1a1a1a;
}

:global(.dark .vue-flow__controls) {
  background: #2a2a2a;
  border: 1px solid #444;
}

:global(.dark .vue-flow__controls button) {
  background: #3a3a3a;
  border: 1px solid #555;
  color: white;
}

:global(.dark .vue-flow__controls button:hover) {
  background: #4a4a4a;
}

:global(.dark .vue-flow__minimap) {
  background: #2a2a2a;
  border: 1px solid #444;
}
</style>
