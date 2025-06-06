<template>
  <rect
    :class="['vue-flow__minimap-node', { selected }, className]"
    :x="x"
    :y="y"
    :rx="borderRadius"
    :ry="borderRadius"
    :width="width"
    :height="height"
    :style="{
      fill: fill,
      stroke: strokeColor,
      strokeWidth: strokeWidth,
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
