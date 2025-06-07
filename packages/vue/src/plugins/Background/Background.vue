<template>
  <svg class="vue-flow__background" :style="bgStyle">
    <defs v-if="variant !== BackgroundVariant.Lines">
      <pattern
        :id="patternId"
        :x="patternOffset[0]"
        :y="patternOffset[1]"
        :width="scaledGap[0]"
        :height="scaledGap[1]"
        patternUnits="userSpaceOnUse"
      >
        <circle
          v-if="variant === BackgroundVariant.Dots"
          :cx="scaledSize / 2"
          :cy="scaledSize / 2"
          :r="scaledSize / 2"
          :fill="patternColor"
        />
        <rect
          v-else-if="variant === BackgroundVariant.Cross"
          :width="scaledSize"
          :height="scaledSize"
          :fill="patternColor"
          :x="(scaledGap[0] - scaledSize) / 2"
          :y="(scaledGap[1] - scaledSize) / 2"
        />
      </pattern>
    </defs>
    
    <rect
      v-if="variant === BackgroundVariant.Lines"
      width="100%"
      height="100%"
      :fill="`url(#${patternId})`"
      :stroke="patternColor"
      :stroke-width="size"
    />
    <rect
      v-else
      width="100%"
      height="100%"
      :fill="`url(#${patternId})`"
    />
  </svg>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import { VUE_FLOW_SYMBOL } from '../../symbols';
import type { StyleValue } from 'vue';

enum BackgroundVariant {
  Lines = 'lines',
  Dots = 'dots',
  Cross = 'cross'
}

interface BackgroundProps {
  variant?: BackgroundVariant;
  gap?: number | [number, number];
  size?: number;
  lineWidth?: number;
  offset?: number;
  color?: string;
  style?: StyleValue;
  className?: string;
}

const props = withDefaults(defineProps<BackgroundProps>(), {
  variant: BackgroundVariant.Dots,
  gap: 20,
  size: 1,
  lineWidth: 1,
  offset: 2,
  color: '#81818a'
});

const store = inject(VUE_FLOW_SYMBOL);
const viewport = store?.viewport || { x: 0, y: 0, zoom: 1 };

const patternId = computed(() => `vue-flow-background-${Math.random().toString(36).substr(2, 9)}`);

const scaledGap = computed(() => {
  const gapArray = Array.isArray(props.gap) ? props.gap : [props.gap, props.gap];
  return [gapArray[0] * viewport.zoom, gapArray[1] * viewport.zoom];
});

const scaledSize = computed(() => props.size * viewport.zoom);

const patternOffset = computed(() => [
  viewport.x % scaledGap.value[0],
  viewport.y % scaledGap.value[1]
]);

const patternColor = computed(() => props.color);

const bgStyle = computed<StyleValue>(() => ({
  position: 'absolute',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
  ...(props.style && typeof props.style === 'object' ? props.style : {})
}));
</script>


