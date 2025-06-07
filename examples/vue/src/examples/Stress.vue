<template>
  <div class="stress-example">
    <VueFlow
      ref="vueFlowRef"
      :key="flowKey"
      v-model:nodes="nodes"
      v-model:edges="edges"
      :min-zoom="0.2"
      :fit-view-on-init="true"
      @connect="onConnect"
      @nodes-change="onNodesChange"
      @edges-change="onEdgesChange"
    >
      <Background />
      <Controls />
      <Panel position="top-right" class="controls-panel">
        <div class="stress-controls">
          <h3>Performance Testing</h3>
          <div class="button-group">
            <button @click="selectRandomNode">Select Random Node</button>
            <button @click="dragNodeInViewport">Drag Node in Viewport</button>
            <button @click="dragNodeOutsideViewport">Drag Node Outside Viewport</button>
            <button @click="remountFlow">Re-mount Flow</button>
            <button @click="updatePositions">Change Positions</button>
            <button @click="updateElements">Update Elements</button>
          </div>
          <div class="grid-controls">
            <label>
              Grid Size: {{ gridSize }}x{{ gridSize }}
              <input 
                v-model.number="gridSize" 
                type="range" 
                min="5" 
                max="50" 
                @change="updateElements"
              />
            </label>
          </div>
          <div class="performance-info">
            <p><strong>Nodes:</strong> {{ nodes.length }}</p>
            <p><strong>Edges:</strong> {{ edges.length }}</p>
            <p><small>Check console for performance measurements</small></p>
          </div>
        </div>
      </Panel>
    </VueFlow>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';
import {
  VueFlow,
  Background,
  Controls,
  Panel,
  type Node,
  type Edge,
  type Connection,
  type NodeChange,
  type EdgeChange,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/vue';

// CSS imports
import '@xyflow/vue/dist/base.css';
import '@xyflow/vue/dist/style.css';

// Initial grid size
const gridSize = ref(25);

// Flow key for remounting
const flowKey = ref(0);

// Generate nodes and edges function
function generateNodesAndEdges(xElements = 10, yElements = 10) {
  const initialNodes: Node[] = [];
  const initialEdges: Edge[] = [];
  let nodeId = 1;
  let recentNodeId: number | null = null;

  for (let y = 0; y < yElements; y++) {
    for (let x = 0; x < xElements; x++) {
      const position = { x: x * 100, y: y * 50 };
      const data = { label: `Node ${nodeId}` };
      const node: Node = {
        id: nodeId.toString(),
        position,
        data,
        style: { width: '50px', height: '30px', fontSize: '11px' },
      };
      initialNodes.push(node);

      if (recentNodeId && nodeId <= xElements * yElements) {
        initialEdges.push({
          id: `${x}-${y}`,
          source: recentNodeId.toString(),
          target: nodeId.toString(),
        });
      }

      recentNodeId = nodeId;
      nodeId++;
    }
  }

  return {
    nodes: initialNodes,
    edges: initialEdges,
  };
}

// Initial data
const { nodes: initialNodes, edges: initialEdges } = generateNodesAndEdges(gridSize.value, gridSize.value);
const nodes = ref<Node[]>(initialNodes);
const edges = ref<Edge[]>(initialEdges);

// Vue Flow instance
const vueFlowRef = ref();

// Performance measurement utilities
class FrameRecorder {
  private frames: Array<{ duration: number; stage: string }> = [];
  private animationFrameId: number = 0;
  private stage: string = '<no stage>';

  constructor() {
    let lastFrameTimestamp = performance.now();

    const measureFrame = () => {
      const timestamp = performance.now();

      // Visualize frames in Performance pane
      performance.measure(`frame (${this.stage})`, {
        start: lastFrameTimestamp,
        end: timestamp,
      });

      this.frames.push({
        duration: timestamp - lastFrameTimestamp,
        stage: this.stage,
      });

      lastFrameTimestamp = timestamp;
      this.animationFrameId = requestAnimationFrame(measureFrame);
    };

    this.animationFrameId = requestAnimationFrame(measureFrame);
  }

  setStage(stage: string) {
    this.stage = stage;
  }

  async endRecordingAsync() {
    cancelAnimationFrame(this.animationFrameId);
    await nextTick();
  }

  getFrames() {
    return this.frames;
  }

  getFramesForObservable() {
    return JSON.stringify(this.frames);
  }
}

function generateMouseEventParams(element: Element) {
  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  return {
    clientX: centerX,
    clientY: centerY,
    screenX: centerX,
    screenY: centerY,
    bubbles: true,
    cancelable: true,
  };
}

// Event handlers
const onConnect = (connection: Connection) => {
  edges.value = addEdge(connection, edges.value);
};

const onNodesChange = (changes: NodeChange[]) => {
  nodes.value = applyNodeChanges(changes, nodes.value);
};

const onEdgesChange = (changes: EdgeChange[]) => {
  edges.value = applyEdgeChanges(changes, edges.value);
};

// Performance test functions
const selectRandomNode = async () => {
  const randomNodeIndex = Math.floor(Math.random() * nodes.value.length);
  const nodeElement = document.querySelector(`.vue-flow__node[data-id="${nodes.value[randomNodeIndex].id}"]`);
  if (!nodeElement) {
    console.error('Node not found');
    return;
  }

  const frameRecorder = new FrameRecorder();

  const mouseEvent = generateMouseEventParams(nodeElement);

  // mousedown
  frameRecorder.setStage('mousedown');
  nodeElement.dispatchEvent(new MouseEvent('mousedown', mouseEvent));
  await nextTick();

  // click
  frameRecorder.setStage('click');
  nodeElement.dispatchEvent(new MouseEvent('click', mouseEvent));
  await nextTick();

  // mouseup
  frameRecorder.setStage('mouseup');
  nodeElement.dispatchEvent(new MouseEvent('mouseup', mouseEvent));
  await nextTick();

  // Log results
  await frameRecorder.endRecordingAsync();
  console.log('Select node - Frame durations:', frameRecorder.getFrames());
  console.log('Select node - For Observable:', frameRecorder.getFramesForObservable());
};

const dragNodeInViewport = async () => {
  // Target node 18 as it's typically in the right part of viewport
  const nodeElement = document.querySelector('.vue-flow__node[data-id="18"]');
  if (!nodeElement) {
    console.error('Node with id 18 not found');
    return;
  }

  const frameRecorder = new FrameRecorder();

  // Hold down the mouse
  frameRecorder.setStage('mousedown');
  const mouseDownEvent = generateMouseEventParams(nodeElement);
  nodeElement.dispatchEvent(new MouseEvent('mousedown', mouseDownEvent));
  await nextTick();

  // Move the mouse 5px to the left on every frame
  frameRecorder.setStage('mousemove');
  let currentXPosition = mouseDownEvent.clientX;
  for (let iteration = 0; iteration < 20; ++iteration) {
    const movementX = -5;
    currentXPosition += movementX;

    nodeElement.dispatchEvent(
      new MouseEvent('mousemove', {
        ...mouseDownEvent,
        clientX: currentXPosition,
        screenX: currentXPosition,
        movementX,
      })
    );
    await nextTick();
  }

  // Release the mouse
  frameRecorder.setStage('mouseup');
  nodeElement.dispatchEvent(
    new MouseEvent('mouseup', {
      ...mouseDownEvent,
      clientX: currentXPosition,
      screenX: currentXPosition,
    })
  );
  await nextTick();

  // Log results
  await frameRecorder.endRecordingAsync();
  console.log('Drag in viewport - Frame durations:', frameRecorder.getFrames());
  console.log('Drag in viewport - For Observable:', frameRecorder.getFramesForObservable());
};

const dragNodeOutsideViewport = async () => {
  const randomNodeIndex = Math.floor(Math.random() * nodes.value.length);
  const nodeElement = document.querySelector(`.vue-flow__node[data-id="${nodes.value[randomNodeIndex].id}"]`);
  if (!nodeElement) {
    console.error('Node not found');
    return;
  }

  const frameRecorder = new FrameRecorder();

  // Hold down the mouse
  frameRecorder.setStage('mousedown');
  const mouseDownEvent = generateMouseEventParams(nodeElement);
  nodeElement.dispatchEvent(new MouseEvent('mousedown', mouseDownEvent));
  await nextTick();

  // Move mouse to top of viewport and wiggle to keep scrolling
  frameRecorder.setStage('mousemove');
  let currentYPosition = 50;
  for (let iteration = 0; iteration < 20; ++iteration) {
    const movementY = Math.random() > 0.5 ? +2 : -2;
    currentYPosition += movementY;

    nodeElement.dispatchEvent(
      new MouseEvent('mousemove', {
        ...mouseDownEvent,
        clientY: currentYPosition,
        screenY: currentYPosition,
        movementY,
      })
    );
    await nextTick();
  }

  // Release the mouse
  frameRecorder.setStage('mouseup');
  nodeElement.dispatchEvent(
    new MouseEvent('mouseup', {
      ...mouseDownEvent,
      clientY: currentYPosition,
      screenY: currentYPosition,
    })
  );
  await nextTick();

  // Log results
  await frameRecorder.endRecordingAsync();
  console.log('Drag outside viewport - Frame durations:', frameRecorder.getFrames());
  console.log('Drag outside viewport - For Observable:', frameRecorder.getFramesForObservable());
};

const remountFlow = () => {
  flowKey.value += 1;
  console.log('Flow remounted');
};

const updatePositions = () => {
  nodes.value = nodes.value.map((node) => ({
    ...node,
    position: {
      x: Math.random() * window.innerWidth * 4,
      y: Math.random() * window.innerHeight * 4,
    },
  }));
  nextTick(() => vueFlowRef.value?.fitView());
  console.log('Positions updated');
};

const updateElements = () => {
  const { nodes: newNodes, edges: newEdges } = generateNodesAndEdges(gridSize.value, gridSize.value);
  nodes.value = newNodes;
  edges.value = newEdges;
  console.log(`Elements updated: ${newNodes.length} nodes, ${newEdges.length} edges`);
};
</script>

<style scoped>
.stress-example {
  width: 100%;
  height: 100vh;
}

.controls-panel {
  max-width: 300px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 16px;
}

.stress-controls h3 {
  margin-top: 0;
  margin-bottom: 16px;
  color: #333;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.button-group button {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.2s;
}

.button-group button:hover {
  background: #f5f5f5;
}

.grid-controls {
  margin-bottom: 16px;
}

.grid-controls label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 12px;
  color: #666;
}

.grid-controls input[type="range"] {
  width: 100%;
}

.performance-info {
  font-size: 12px;
  color: #666;
}

.performance-info p {
  margin: 4px 0;
}
</style>
