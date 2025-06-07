<template>
  <span class="vue-flow__edge-text" :style="style">
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { StyleValue } from 'vue';

interface EdgeTextProps {
  x: number;
  y: number;
  label?: string;
  labelStyle?: StyleValue;
  labelShowBg?: boolean;
  labelBgStyle?: StyleValue;
  labelBgPadding?: [number, number];
  labelBgBorderRadius?: number;
}

const props = withDefaults(defineProps<EdgeTextProps>(), {
  labelShowBg: true,
  labelBgPadding: () => [2, 4],
  labelBgBorderRadius: 2
});

const style = computed<StyleValue>(() => ({
  position: 'absolute',
  transform: `translate(-50%, -50%) translate(${props.x}px, ${props.y}px)`,
  fontSize: '10px',
  ...(props.labelStyle && typeof props.labelStyle === 'object' ? props.labelStyle : {})
}));
</script>


