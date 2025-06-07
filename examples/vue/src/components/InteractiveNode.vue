<template>
  <div 
    :class="['interactive-node', statusClass]"
    :style="nodeStyle"
  >
    <Handle
      type="target"
      :position="Position.Left"
      :style="{ background: '#555' }"
    />
    
    <div class="interactive-node-content">
      <div class="node-title">
        {{ data.label || 'Interactive Node' }}
      </div>
      
      <div class="interaction-stats">
        <div class="stat">
          <span class="stat-label">Clicks:</span>
          <span class="stat-value">{{ data.clickCount || 0 }}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Status:</span>
          <span class="stat-value">{{ data.status || 'idle' }}</span>
        </div>
      </div>
      
      <div class="interactive-controls">
        <button 
          class="nodrag action-btn"
          @click="handleClick"
          :disabled="data.status === 'processing'"
        >
          {{ getButtonText() }}
        </button>
        
        <button 
          class="nodrag action-btn secondary"
          @click="resetNode"
        >
          Reset
        </button>
        
        <div class="toggle-group">
          <label class="nodrag">
            <input 
              type="checkbox" 
              :checked="data.enabled !== false"
              @change="toggleEnabled"
            />
            Enabled
          </label>
        </div>
      </div>
      
      <div class="progress-indicator" v-if="data.status === 'processing'">
        <div class="progress-bar" :style="{ width: `${progressValue}%` }"></div>
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
import { computed, ref, watch } from 'vue';
import { Handle, Position } from '@xyflow/vue';

interface InteractiveNodeData {
  label?: string;
  clickCount?: number;
  status?: 'idle' | 'processing' | 'completed' | 'error';
  enabled?: boolean;
  value?: number;
}

// Props interface (using all relevant props directly to avoid extends issue)
interface Props {
  id: string;
  data: InteractiveNodeData;
  selected?: boolean;
  dragging?: boolean;
  type?: string;
  zIndex?: number;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update-node': [nodeId: string, data: InteractiveNodeData];
}>();

const progressValue = ref(0);

const statusClass = computed(() => {
  const status = props.data.status || 'idle';
  return `status-${status}`;
});

const nodeStyle = computed(() => {
  const enabled = props.data.enabled !== false;
  return {
    opacity: enabled ? 1 : 0.6,
    transform: props.selected ? 'scale(1.05)' : 'scale(1)',
  };
});

const getButtonText = () => {
  switch (props.data.status) {
    case 'processing':
      return 'Processing...';
    case 'completed':
      return 'Complete!';
    case 'error':
      return 'Error!';
    default:
      return 'Click Me';
  }
};

const handleClick = async () => {
  if (props.data.enabled === false || props.data.status === 'processing') {
    return;
  }

  const clickCount = (props.data.clickCount || 0) + 1;
  
  // Update to processing state
  emit('update-node', props.id, {
    ...props.data,
    clickCount,
    status: 'processing',
  });

  // Simulate processing with progress
  progressValue.value = 0;
  const progressInterval = setInterval(() => {
    progressValue.value += 10;
    if (progressValue.value >= 100) {
      clearInterval(progressInterval);
    }
  }, 100);

  // Simulate async operation
  setTimeout(() => {
    const isError = Math.random() < 0.1; // 10% chance of error
    const newStatus = isError ? 'error' : 'completed';
    
    emit('update-node', props.id, {
      ...props.data,
      clickCount,
      status: newStatus,
      value: isError ? props.data.value : (props.data.value || 0) + 1,
    });

    // Reset to idle after 2 seconds
    setTimeout(() => {
      emit('update-node', props.id, {
        ...props.data,
        clickCount,
        status: 'idle',
        value: isError ? props.data.value : (props.data.value || 0) + 1,
      });
    }, 2000);
  }, 1000);
};

const resetNode = () => {
  emit('update-node', props.id, {
    ...props.data,
    clickCount: 0,
    status: 'idle',
    value: 0,
  });
  progressValue.value = 0;
};

const toggleEnabled = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update-node', props.id, {
    ...props.data,
    enabled: target.checked,
  });
};

// Watch for status changes to handle progress reset
watch(() => props.data.status, (newStatus) => {
  if (newStatus !== 'processing') {
    progressValue.value = 0;
  }
});
</script>

<style scoped>
.interactive-node {
  min-width: 200px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 2px solid transparent;
  transition: transform 0.2s, border-color 0.2s;
  position: relative;
  overflow: hidden;
}

.interactive-node.status-processing {
  border-color: #ffd700;
  animation: pulse 1s infinite;
}

.interactive-node.status-completed {
  border-color: #4caf50;
}

.interactive-node.status-error {
  border-color: #f44336;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}

.interactive-node-content {
  padding: 16px;
}

.node-title {
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 12px;
}

.interaction-stats {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 11px;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-label {
  opacity: 0.8;
  margin-bottom: 2px;
}

.stat-value {
  font-weight: bold;
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 20px;
  text-align: center;
}

.interactive-controls {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
}

.action-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 100px;
}

.action-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-btn.secondary {
  background: rgba(255, 255, 255, 0.1);
  min-width: 60px;
  padding: 4px 12px;
  font-size: 10px;
}

.toggle-group {
  margin-top: 8px;
}

.toggle-group label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  cursor: pointer;
}

.toggle-group input[type="checkbox"] {
  cursor: pointer;
}

.progress-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: rgba(255, 255, 255, 0.2);
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #4caf50, #8bc34a);
  transition: width 0.1s ease;
}

/* Prevent dragging on interactive elements */
.nodrag {
  pointer-events: all;
}
</style>
