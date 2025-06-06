<template>
  <Panel
    :class="['vue-flow__controls', props.class]"
    :position="position"
    :style="style"
  >
    <button
      v-if="showZoom"
      :class="['vue-flow__controls-button', 'vue-flow__controls-zoomin']"
      @click="onZoomIn"
      :disabled="!store || viewport.zoom >= maxZoom"
    >
      <slot name="zoom-in-icon">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="M21 21l-4.35-4.35"></path>
          <line x1="11" y1="8" x2="11" y2="14"></line>
          <line x1="8" y1="11" x2="14" y2="11"></line>
        </svg>
      </slot>
    </button>
    
    <button
      v-if="showZoom"
      :class="['vue-flow__controls-button', 'vue-flow__controls-zoomout']"
      @click="onZoomOut"
      :disabled="!store || viewport.zoom <= minZoom"
    >
      <slot name="zoom-out-icon">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="M21 21l-4.35-4.35"></path>
          <line x1="8" y1="11" x2="14" y2="11"></line>
        </svg>
      </slot>
    </button>
    
    <button
      v-if="showFitView"
      :class="['vue-flow__controls-button', 'vue-flow__controls-fitview']"
      @click="onFitView"
      :disabled="!store"
    >
      <slot name="fit-view-icon">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
        </svg>
      </slot>
    </button>
    
    <button
      v-if="showInteractive"
      :class="['vue-flow__controls-button', 'vue-flow__controls-interactive']"
      @click="onToggleInteractivity"
      :disabled="!store"
    >
      <slot name="interactive-icon">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <circle cx="9" cy="9" r="2"></circle>
          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
        </svg>
      </slot>
    </button>
    
    <slot />
  </Panel>
</template>

<script setup lang="ts">
import { inject, computed } from 'vue';
import { VUE_FLOW_SYMBOL } from '../../symbols';
import Panel from '../../components/Panel.vue';
import type { PanelPosition, FitViewOptions } from '../../types';
import type { CSSProperties } from 'vue';

interface ControlsProps {
  showZoom?: boolean;
  showFitView?: boolean;
  showInteractive?: boolean;
  fitViewOptions?: FitViewOptions;
  position?: PanelPosition;
  class?: string;
  style?: CSSProperties;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onFitView?: () => void;
  onInteractiveChange?: (interactiveStatus: boolean) => void;
}

const props = withDefaults(defineProps<ControlsProps>(), {
  showZoom: true,
  showFitView: true,
  showInteractive: true,
  position: 'bottom-left'
});

const store = inject(VUE_FLOW_SYMBOL);
const viewport = computed(() => store?.viewport || { x: 0, y: 0, zoom: 1 });
const minZoom = 0.1;
const maxZoom = 2;

const onZoomIn = () => {
  if (props.onZoomIn) {
    props.onZoomIn();
  } else if (store?.zoomIn) {
    store.zoomIn();
  }
};

const onZoomOut = () => {
  if (props.onZoomOut) {
    props.onZoomOut();
  } else if (store?.zoomOut) {
    store.zoomOut();
  }
};

const onFitView = () => {
  if (props.onFitView) {
    props.onFitView();
  } else if (store?.fitView) {
    store.fitView(props.fitViewOptions);
  }
};

const onToggleInteractivity = () => {
  // Implementation for toggling interactivity
  if (props.onInteractiveChange) {
    props.onInteractiveChange(true);
  }
};
</script>

<script lang="ts">
export default {
  name: 'Controls'
};
</script>
