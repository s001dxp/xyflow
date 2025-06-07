<template>
  <div class="node-toolbar-example">
    <VueFlow
      ref="vueFlowRef"
      v-model:nodes="nodes"
      v-model:edges="edges"
      :fit-view-on-init="true"
      @connect="onConnect"
      @selection-change="onSelectionChange"
    >
      <Background pattern="dots" />
      <Controls />
      
      <!-- Node Toolbar - only show when nodes are selected -->
      <NodeToolbar 
        v-if="selectedNodes.length > 0"
        :node-id="selectedNodes[0].id"
        :position="toolbarPosition"
        align="center"
      >
        <div class="toolbar-content">
          <button @click="deleteNode" title="Delete Node">🗑️</button>
          <button @click="duplicateNode" title="Duplicate Node">📋</button>
          <button @click="changeNodeColor" title="Change Color">🎨</button>
          <button @click="toggleNodeType" title="Toggle Type">🔄</button>
        </div>
      </NodeToolbar>
      
      <Panel position="top-right" class="description">
        <div>
          <h3>Node Toolbar Example</h3>
          <p>
            Select a node to see the toolbar appear. The toolbar provides
            contextual actions for the selected node.
          </p>
          <div class="button-group">
            <button @click="addNode">Add Node</button>
            <button @click="selectRandomNode">Select Random Node</button>
          </div>
          <div class="info">
            <span>Selected: {{ selectedNodes.length }} nodes</span>
            <span>Total: {{ nodes.length }} nodes</span>
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
  NodeToolbar,
  type Node,
  type Edge,
  type Connection,
  Position,
} from '@xyflow/vue';

// CSS imports
import '@xyflow/vue/dist/base.css';
import '@xyflow/vue/dist/style.css';

// Vue Flow instance
const vueFlowRef = ref();

// Toolbar settings
const toolbarPosition = ref<Position>(Position.Top);

// Node colors
const nodeColors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#a8e6cf'];
const nodeTypes = ['default', 'input', 'output'];

// Initial nodes
const nodes = ref<Node[]>([
  {
    id: '1',
    type: 'default',
    position: { x: 200, y: 100 },
    data: { label: 'Node 1' },
    style: { background: '#ff6b6b', color: 'white' },
  },
  {
    id: '2',
    type: 'input',
    position: { x: 400, y: 200 },
    data: { label: 'Node 2' },
    style: { background: '#4ecdc4', color: 'white' },
  },
  {
    id: '3',
    type: 'output',
    position: { x: 300, y: 300 },
    data: { label: 'Node 3' },
    style: { background: '#45b7d1', color: 'white' },
  },
]);

// Initial edges
const edges = ref<Edge[]>([
  {
    id: 'e1-2',
    source: '1',
    target: '2',
  },
  {
    id: 'e2-3',
    source: '2',
    target: '3',
  },
]);

// Selection state
const selectedNodes = ref<Node[]>([]);

// Event handlers
const onConnect = (connection: Connection) => {
  const newEdge: Edge = {
    id: `e${connection.source}-${connection.target}`,
    source: connection.source!,
    target: connection.target!,
  };
  edges.value.push(newEdge);
};

const onSelectionChange = ({ nodes: selected }: { nodes: Node[], edges: Edge[] }) => {
  selectedNodes.value = selected;
};

// Toolbar actions
const deleteNode = () => {
  if (selectedNodes.value.length > 0) {
    const nodeId = selectedNodes.value[0].id;
    
    // Remove node
    nodes.value = nodes.value.filter(node => node.id !== nodeId);
    
    // Remove connected edges
    edges.value = edges.value.filter(edge => 
      edge.source !== nodeId && edge.target !== nodeId
    );
    
    selectedNodes.value = [];
  }
};

const duplicateNode = () => {
  if (selectedNodes.value.length > 0) {
    const originalNode = selectedNodes.value[0];
    const newNode: Node = {
      id: `node-${Date.now()}`,
      type: originalNode.type,
      position: {
        x: originalNode.position.x + 50,
        y: originalNode.position.y + 50,
      },
      data: { label: `${originalNode.data.label} (copy)` },
      style: originalNode.style,
    };
    
    nodes.value.push(newNode);
  }
};

const changeNodeColor = () => {
  if (selectedNodes.value.length > 0) {
    const node = selectedNodes.value[0];
    const currentColor = node.style?.background || '#ff6b6b';
    const currentIndex = nodeColors.indexOf(currentColor);
    const nextIndex = (currentIndex + 1) % nodeColors.length;
    const newColor = nodeColors[nextIndex];
    
    node.style = {
      ...node.style,
      background: newColor,
      color: 'white',
    };
  }
};

const toggleNodeType = () => {
  if (selectedNodes.value.length > 0) {
    const node = selectedNodes.value[0];
    const currentType = node.type || 'default';
    const currentIndex = nodeTypes.indexOf(currentType);
    const nextIndex = (currentIndex + 1) % nodeTypes.length;
    
    node.type = nodeTypes[nextIndex];
  }
};

// Panel actions
const addNode = () => {
  const randomColor = nodeColors[Math.floor(Math.random() * nodeColors.length)];
  const randomPosition = { 
    x: Math.random() * 400 + 100, 
    y: Math.random() * 300 + 100 
  };
  const newNode: Node = {
    id: `node-${Date.now()}`,
    type: 'default',
    position: vueFlowRef.value?.project(randomPosition) || randomPosition,
    data: { label: `Node ${nodes.value.length + 1}` },
    style: { background: randomColor, color: 'white' },
  };
  
  nodes.value.push(newNode);
};

const selectRandomNode = () => {
  if (nodes.value.length > 0) {
    // Clear current selection
    nodes.value.forEach(node => node.selected = false);
    
    // Select random node
    const randomIndex = Math.floor(Math.random() * nodes.value.length);
    nodes.value[randomIndex].selected = true;
    
    selectedNodes.value = [nodes.value[randomIndex]];
  }
};
</script>

<style scoped>
.node-toolbar-example {
  width: 100%;
  height: 100%;
}

.toolbar-content {
  display: flex;
  background: white;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  border: 1px solid #e1e1e1;
  overflow: hidden;
}

.toolbar-content button {
  padding: 8px 12px;
  border: none;
  background: white;
  cursor: pointer;
  font-size: 14px;
  border-right: 1px solid #e1e1e1;
  transition: background-color 0.2s;
}

.toolbar-content button:last-child {
  border-right: none;
}

.toolbar-content button:hover {
  background: #f5f5f5;
}

.toolbar-content button:active {
  background: #e8e8e8;
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
  margin-bottom: 15px;
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

.info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
  color: #666;
  padding-top: 10px;
  border-top: 1px solid #eee;
}

.info span {
  padding: 4px 8px;
  background: #f8f9fa;
  border-radius: 3px;
}
</style>
