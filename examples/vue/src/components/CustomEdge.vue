<template>
  <g :class="edgeClasses">
    <path
      :id="`edge-path-${id}`"
      :d="edgePath"
      :style="edgeStyle"
      class="vue-flow__edge-path"
      :marker-end="markerEnd"
    />
    
    <!-- Edge label -->
    <text
      v-if="data?.label"
      class="vue-flow__edge-text"
      :style="labelStyle"
    >
      <textPath 
        :href="`#edge-path-${id}`"
        startOffset="50%"
        text-anchor="middle"
      >
        {{ data.label }}
      </textPath>
    </text>
    
    <!-- Interactive label/button -->
    <foreignObject
      v-if="data?.interactive"
      :x="labelX - 40"
      :y="labelY - 15"
      width="80"
      height="30"
      class="vue-flow__edge-label"
    >
      <div 
        class="custom-edge-label"
        :style="{ backgroundColor: data.color || '#ff6b6b' }"
        @click="onLabelClick"
      >
        {{ data.buttonText || '×' }}
      </div>
    </foreignObject>
    
    <!-- Animated particles -->
    <g v-if="data?.animated">
      <circle
        class="edge-particle"
        r="2"
        :fill="data.color || '#4ecdc4'"
      >
        <animateMotion
          :dur="`${data.speed || 3}s`"
          repeatCount="indefinite"
        >
          <mpath :href="`#edge-path-${id}`" />
        </animateMotion>
      </circle>
    </g>
  </g>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { getBezierPath, Position } from '@xyflow/vue';

interface CustomEdgeData {
  label?: string;
  interactive?: boolean;
  buttonText?: string;
  animated?: boolean;
  color?: string;
  speed?: number;
  thickness?: number;
}

// Props interface (using all relevant props directly to avoid extends issue)
interface Props {
  id: string;
  source: string;
  target: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  sourcePosition: Position;
  targetPosition: Position;
  data?: CustomEdgeData;
  selected?: boolean;
  markerEnd?: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'edge-click': [edgeId: string, data: any];
}>();

// Calculate edge path and label position
const [edgePath, labelX, labelY] = getBezierPath({
  sourceX: props.sourceX,
  sourceY: props.sourceY,
  sourcePosition: props.sourcePosition,
  targetX: props.targetX,
  targetY: props.targetY,
  targetPosition: props.targetPosition,
});

const edgeClasses = computed(() => [
  'vue-flow__edge',
  'custom-edge',
  {
    'selected': props.selected,
    'animated': props.data?.animated,
    'interactive': props.data?.interactive,
  }
]);

const edgeStyle = computed(() => ({
  stroke: props.data?.color || '#b1b1b7',
  strokeWidth: props.data?.thickness || 2,
  fill: 'none',
  strokeDasharray: props.data?.animated ? '5,5' : undefined,
  animation: props.data?.animated ? 'dash 1s linear infinite' : undefined,
}));

const labelStyle = computed(() => ({
  fontSize: '12px',
  fill: props.data?.color || '#333',
  fontWeight: 'bold',
}));

const markerEnd = computed(() => {
  if (props.markerEnd) return props.markerEnd;
  return `url(#custom-marker-${props.data?.color ? 'colored' : 'default'})`;
});

const onLabelClick = (event: MouseEvent) => {
  event.stopPropagation();
  emit('edge-click', props.id, props.data);
};
</script>

<style scoped>
.custom-edge {
  cursor: pointer;
}

.custom-edge.selected .vue-flow__edge-path {
  stroke: #1a73e8;
  stroke-width: 3;
}

.custom-edge.interactive:hover .vue-flow__edge-path {
  stroke-width: 3;
  filter: brightness(1.2);
}

.custom-edge-label {
  background: #ff6b6b;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 12px;
  color: white;
  font-size: 10px;
  font-weight: bold;
  padding: 4px 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.custom-edge-label:hover {
  transform: scale(1.1);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
}

.edge-particle {
  filter: drop-shadow(0 0 3px currentColor);
}

@keyframes dash {
  to {
    stroke-dashoffset: 10;
  }
}

.vue-flow__edge-text {
  pointer-events: none;
  user-select: none;
}

.vue-flow__edge-label {
  pointer-events: all;
}
</style>

<style>
/* Global styles for markers */
.vue-flow__edge-markers {
  pointer-events: none;
}

/* Custom arrow markers */
.vue-flow__edge-markers defs marker#custom-marker-default {
  fill: #b1b1b7;
}

.vue-flow__edge-markers defs marker#custom-marker-colored {
  fill: currentColor;
}
</style>
