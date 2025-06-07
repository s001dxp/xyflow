<template>
  <div
    v-if="node"
    ref="resizeControlRef"
    :class="[
      'vue-flow__resize-control',
      'nodrag',
      'nopan',
      `vue-flow__resize-control-${position}`,
      `vue-flow__resize-control-variant-${variant}`,
      props.class
    ]"
    :style="controlStyle"
    @mousedown="onMouseDown"
    @touchstart="onTouchStart"
  />
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { select } from 'd3-selection';
import { drag } from 'd3-drag';
import {
  ResizeControlVariant,
  getNodeDimensions,
  nodeToParentExtent,
  getNodePositionWithOrigin,
  NodeOrigin,
} from '@xyflow/system';

import { useStore, useStoreApi } from '../../composables/useStore';
import type { FlowStore } from '../../types';
import type { ResizeControlProps } from './types';

// Props with defaults
const props = withDefaults(defineProps<ResizeControlProps>(), {
  variant: ResizeControlVariant.Handle,
  minWidth: 10,
  minHeight: 10,
  maxWidth: Number.MAX_VALUE,
  maxHeight: Number.MAX_VALUE,
  keepAspectRatio: false,
});

// Emits
const emit = defineEmits<{
  resizeStart: [event: any, params: any];
  resize: [event: any, params: any];
  resizeEnd: [event: any, params: any];
}>();

// Refs
const resizeControlRef = ref<HTMLDivElement>();

// Store
const store = useStoreApi();

// Get node from store
const nodeSelector = computed(() => (s: FlowStore) => {
  const nodeInternals = s.nodeLookup.get(props.nodeId || '');
  return nodeInternals || null;
});

const node = useStore(nodeSelector.value);

// Computed styles
const controlStyle = computed(() => {
  if (!node) return {};
  
  const { x, y } = node.internals.positionAbsolute;
  const { width, height } = getNodeDimensions(node.internals.userNode);
  
  const baseStyle: any = {
    position: 'absolute',
    pointerEvents: 'all',
    ...props.style,
  };

  // Position the control based on position prop
  switch (props.position) {
    case 'top-left':
      baseStyle.left = `${x - 5}px`;
      baseStyle.top = `${y - 5}px`;
      baseStyle.cursor = 'nw-resize';
      break;
    case 'top-right':
      baseStyle.left = `${x + width - 5}px`;
      baseStyle.top = `${y - 5}px`;
      baseStyle.cursor = 'ne-resize';
      break;
    case 'bottom-left':
      baseStyle.left = `${x - 5}px`;
      baseStyle.top = `${y + height - 5}px`;
      baseStyle.cursor = 'sw-resize';
      break;
    case 'bottom-right':
      baseStyle.left = `${x + width - 5}px`;
      baseStyle.top = `${y + height - 5}px`;
      baseStyle.cursor = 'se-resize';
      break;
    case 'top':
      baseStyle.left = `${x + width / 2 - 5}px`;
      baseStyle.top = `${y - 2}px`;
      baseStyle.cursor = 'n-resize';
      break;
    case 'bottom':
      baseStyle.left = `${x + width / 2 - 5}px`;
      baseStyle.top = `${y + height - 2}px`;
      baseStyle.cursor = 's-resize';
      break;
    case 'left':
      baseStyle.left = `${x - 2}px`;
      baseStyle.top = `${y + height / 2 - 5}px`;
      baseStyle.cursor = 'w-resize';
      break;
    case 'right':
      baseStyle.left = `${x + width - 2}px`;
      baseStyle.top = `${y + height / 2 - 5}px`;
      baseStyle.cursor = 'e-resize';
      break;
  }

  // Add variant-specific styles
  if (props.variant === ResizeControlVariant.Line) {
    if (['top', 'bottom'].includes(props.position)) {
      baseStyle.width = `${width}px`;
      baseStyle.height = '4px';
    } else if (['left', 'right'].includes(props.position)) {
      baseStyle.width = '4px';
      baseStyle.height = `${height}px`;
    }
  } else {
    baseStyle.width = '10px';
    baseStyle.height = '10px';
    baseStyle.borderRadius = '2px';
  }

  if (props.color) {
    baseStyle.backgroundColor = props.color;
    baseStyle.borderColor = props.color;
  }

  return baseStyle;
});

// D3 drag setup
onMounted(() => {
  if (!resizeControlRef.value || !node) return;

  const selection = select(resizeControlRef.value);
  
  const dragHandler = drag()
    .on('start', (event) => {
      const startParams = {
        x: node.internals.positionAbsolute.x,
        y: node.internals.positionAbsolute.y,
        width: node.measured.width || 0,
        height: node.measured.height || 0,
        direction: getDirection(props.position),
      };
      
      if (props.shouldResize && !props.shouldResize(event, startParams)) {
        return;
      }
      
      emit('resizeStart', event, startParams);
    })
    .on('drag', (event) => {
      if (!node) return;
      
      const { x: nodeX, y: nodeY } = node.internals.positionAbsolute;
      const { width: nodeWidth, height: nodeHeight } = getNodeDimensions(node.internals.userNode);
      
      let newWidth = nodeWidth;
      let newHeight = nodeHeight;
      let newX = nodeX;
      let newY = nodeY;
      
      const { dx, dy } = event;
      
      // Calculate new dimensions based on position
      switch (props.position) {
        case 'top-left':
          newWidth = nodeWidth - dx;
          newHeight = nodeHeight - dy;
          newX = nodeX + dx;
          newY = nodeY + dy;
          break;
        case 'top-right':
          newWidth = nodeWidth + dx;
          newHeight = nodeHeight - dy;
          newY = nodeY + dy;
          break;
        case 'bottom-left':
          newWidth = nodeWidth - dx;
          newHeight = nodeHeight + dy;
          newX = nodeX + dx;
          break;
        case 'bottom-right':
          newWidth = nodeWidth + dx;
          newHeight = nodeHeight + dy;
          break;
        case 'top':
          newHeight = nodeHeight - dy;
          newY = nodeY + dy;
          break;
        case 'bottom':
          newHeight = nodeHeight + dy;
          break;
        case 'left':
          newWidth = nodeWidth - dx;
          newX = nodeX + dx;
          break;
        case 'right':
          newWidth = nodeWidth + dx;
          break;
      }
      
      // Apply constraints
      newWidth = Math.max(props.minWidth!, Math.min(props.maxWidth!, newWidth));
      newHeight = Math.max(props.minHeight!, Math.min(props.maxHeight!, newHeight));
      
      // Keep aspect ratio if needed
      if (props.keepAspectRatio) {
        const aspectRatio = nodeWidth / nodeHeight;
        if (newWidth / newHeight > aspectRatio) {
          newWidth = newHeight * aspectRatio;
        } else {
          newHeight = newWidth / aspectRatio;
        }
      }
      
      const params = {
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight,
        direction: getDirection(props.position),
      };
      
      // Update node
      const nodeUpdate = {
        id: node.id,
        position: { x: newX, y: newY },
        width: newWidth,
        height: newHeight,
      };
      
      store.getState().updateNodeData(node.id, nodeUpdate);
      
      emit('resize', event, params);
    })
    .on('end', (event) => {
      const endParams = {
        x: node.internals.positionAbsolute.x,
        y: node.internals.positionAbsolute.y,
        width: node.measured.width || 0,
        height: node.measured.height || 0,
      };
      
      emit('resizeEnd', event, endParams);
    });

  selection.call(dragHandler as any);
});

// Helper functions
function getDirection(position: string): number[] {
  switch (position) {
    case 'top-left':
      return [-1, -1];
    case 'top':
      return [0, -1];
    case 'top-right':
      return [1, -1];
    case 'right':
      return [1, 0];
    case 'bottom-right':
      return [1, 1];
    case 'bottom':
      return [0, 1];
    case 'bottom-left':
      return [-1, 1];
    case 'left':
      return [-1, 0];
    default:
      return [0, 0];
  }
}

// Event handlers for touch and mouse
const onMouseDown = (event: MouseEvent) => {
  event.stopPropagation();
};

const onTouchStart = (event: TouchEvent) => {
  event.stopPropagation();
};
</script>

<style>
.vue-flow__resize-control {
  border: 1px solid #3367d9;
  background: #fff;
  z-index: 1000;
}

.vue-flow__resize-control-variant-line {
  background: transparent;
  border: none;
}

.vue-flow__resize-control-variant-line:hover {
  background: rgba(51, 103, 217, 0.3);
}

.vue-flow__resize-control:hover {
  background: #3367d9;
}
</style>
