<template>
  <template v-if="isVisible">
    <!-- Line controls -->
    <template v-for="position in XY_RESIZER_LINE_POSITIONS" :key="`line-${position}`">
      <ResizeControl
        :class="lineClass"
        :style="lineStyle"
        :nodeId="nodeId"
        :position="position"
        :variant="ResizeControlVariant.Line"
        :color="color"
        :minWidth="minWidth"
        :minHeight="minHeight"
        :maxWidth="maxWidth"
        :maxHeight="maxHeight"
        :keepAspectRatio="keepAspectRatio"
        :shouldResize="shouldResize"
        @resizeStart="onResizeStart"
        @resize="onResize"
        @resizeEnd="onResizeEnd"
      />
    </template>
    
    <!-- Handle controls -->
    <template v-for="position in XY_RESIZER_HANDLE_POSITIONS" :key="`handle-${position}`">
      <ResizeControl
        :class="handleClass"
        :style="handleStyle"
        :nodeId="nodeId"
        :position="position"
        :variant="ResizeControlVariant.Handle"
        :color="color"
        :minWidth="minWidth"
        :minHeight="minHeight"
        :maxWidth="maxWidth"
        :maxHeight="maxHeight"
        :keepAspectRatio="keepAspectRatio"
        :shouldResize="shouldResize"
        @resizeStart="onResizeStart"
        @resize="onResize"
        @resizeEnd="onResizeEnd"
      />
    </template>
  </template>
</template>

<script setup lang="ts">
import {
  ResizeControlVariant,
  XY_RESIZER_HANDLE_POSITIONS,
  XY_RESIZER_LINE_POSITIONS,
} from '@xyflow/system';

import ResizeControl from './ResizeControl.vue';
import type { NodeResizerProps } from './types';

// Props with defaults
const props = withDefaults(defineProps<NodeResizerProps>(), {
  isVisible: true,
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

// Event handlers
const onResizeStart = (event: any, params: any) => {
  if (props.onResizeStart) {
    props.onResizeStart(event, params);
  }
  emit('resizeStart', event, params);
};

const onResize = (event: any, params: any) => {
  if (props.onResize) {
    props.onResize(event, params);
  }
  emit('resize', event, params);
};

const onResizeEnd = (event: any, params: any) => {
  if (props.onResizeEnd) {
    props.onResizeEnd(event, params);
  }
  emit('resizeEnd', event, params);
};
</script>
