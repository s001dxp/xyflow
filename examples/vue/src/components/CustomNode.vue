<template>
  <div 
    :class="['custom-node', { selected: selected }]"
    :style="{ backgroundColor: data.color || '#4ecdc4' }"
  >
    <Handle
      type="target"
      :position="Position.Left"
      :style="{ background: '#555' }"
    />
    
    <div class="custom-node-header">
      <strong>{{ data.label || 'Custom Node' }}</strong>
    </div>
    
    <div class="custom-node-body">
      <div v-if="data.value !== undefined" class="node-value">
        Value: {{ data.value }}
      </div>
      
      <div v-if="data.description" class="node-description">
        {{ data.description }}
      </div>
      
      <div class="node-controls">
        <button 
          class="nodrag"
          @click="incrementValue"
          :disabled="!data.interactive"
        >
          +1
        </button>
        <button 
          class="nodrag"
          @click="changeColor"
        >
          🎨
        </button>
      </div>
    </div>
    
    <Handle
      type="source"
      :position="Position.Right"
      :style="{ background: '#555' }"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Handle, Position } from '@xyflow/vue';

// Custom data interface
interface CustomNodeData {
  label?: string;
  value?: number;
  color?: string;
  description?: string;
  interactive?: boolean;
}

// Props interface (using all relevant props directly to avoid extends issue)
interface Props {
  id: string;
  data: CustomNodeData;
  selected?: boolean;
  dragging?: boolean;
  type?: string;
  zIndex?: number;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update-node': [nodeId: string, data: any];
}>();

const selected = computed(() => props.selected);

const incrementValue = () => {
  if (props.data.interactive !== false) {
    const newData = {
      ...props.data,
      value: (props.data.value || 0) + 1,
    };
    emit('update-node', props.id, newData);
  }
};

const changeColor = () => {
  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'];
  const currentColorIndex = colors.indexOf(props.data.color || '#4ecdc4');
  const nextColor = colors[(currentColorIndex + 1) % colors.length];
  
  const newData = {
    ...props.data,
    color: nextColor,
  };
  emit('update-node', props.id, newData);
};
</script>

<style scoped>
.custom-node {
  min-width: 150px;
  border-radius: 8px;
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 2px solid transparent;
  transition: border-color 0.2s, transform 0.2s;
}

.custom-node.selected {
  border-color: #1a73e8;
  transform: scale(1.05);
}

.custom-node-header {
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 6px 6px 0 0;
  text-align: center;
  font-size: 14px;
}

.custom-node-body {
  padding: 12px;
}

.node-value {
  font-size: 12px;
  margin-bottom: 8px;
  opacity: 0.9;
}

.node-description {
  font-size: 11px;
  margin-bottom: 8px;
  opacity: 0.8;
  line-height: 1.3;
}

.node-controls {
  display: flex;
  gap: 4px;
  justify-content: center;
}

.node-controls button {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 11px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.node-controls button:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.3);
}

.node-controls button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Prevent dragging on interactive elements */
.nodrag {
  pointer-events: all;
}
</style>
