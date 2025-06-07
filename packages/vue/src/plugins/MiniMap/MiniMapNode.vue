<template>
  <rect
    :class="['vue-flow__minimap-node', { selected }, className]"
    :x="safeX"
    :y="safeY"
    :rx="safeBorderRadius"
    :ry="safeBorderRadius"
    :width="safeWidth"
    :height="safeHeight"
    :style="{
      fill: fill,
      stroke: strokeColor,
      strokeWidth: safeStrokeWidth,
    }"
    :shape-rendering="shapeRendering"
    @click="handleClick"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { MiniMapNodeProps } from './types';

// Props
const props = defineProps<MiniMapNodeProps>();

// Emits
const emit = defineEmits<{
  click: [event: MouseEvent, id: string];
}>();

// Safe computed values to prevent NaN from reaching SVG attributes
const safeX = computed(() => {
  const val = props.x;
  return isFinite(val) ? val : 0;
});

const safeY = computed(() => {
  const val = props.y;
  return isFinite(val) ? val : 0;
});

const safeWidth = computed(() => {
  const val = props.width;
  return isFinite(val) && val > 0 ? val : 1;
});

const safeHeight = computed(() => {
  const val = props.height;
  return isFinite(val) && val > 0 ? val : 1;
});

const safeBorderRadius = computed(() => {
  const val = props.borderRadius;
  return isFinite(val) && val >= 0 ? val : 0;
});

const safeStrokeWidth = computed(() => {
  const val = props.strokeWidth;
  return (val !== undefined && isFinite(val) && val >= 0) ? val : 0;
});

// Computed fill color
const fill = computed(() => {
  const { background, backgroundColor } = props.style || {};
  return (props.color || background || backgroundColor) as string;
});

// Event handlers
const handleClick = (event: MouseEvent) => {
  if (props.onClick) {
    emit('click', event, props.id);
  }
};
</script>
