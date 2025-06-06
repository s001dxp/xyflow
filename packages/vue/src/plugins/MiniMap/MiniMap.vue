<template>
  <Panel
    :position="position"
    :style="panelStyle"
    :class="['vue-flow__minimap', className]"
    data-testid="vf__minimap"
  >
    <svg
      ref="svgRef"
      :width="elementWidth"
      :height="elementHeight"
      :viewBox="`${x} ${y} ${width} ${height}`"
      class="vue-flow__minimap-svg"
      role="img"
      :aria-labelledby="labelledBy"
      @click="onSvgClick"
    >
      <title v-if="ariaLabel" :id="labelledBy">{{ ariaLabel }}</title>
      <MiniMapNodes
        :nodeColor="nodeColor"
        :nodeStrokeColor="nodeStrokeColor"
        :nodeBorderRadius="nodeBorderRadius"
        :nodeClassName="nodeClassName"
        :nodeStrokeWidth="nodeStrokeWidth"
        :nodeComponent="nodeComponent"
        @node-click="onSvgNodeClick"
      />
      <path
        class="vue-flow__minimap-mask"
        :d="maskPath"
        fill-rule="evenodd"
        pointer-events="none"
      />
    </svg>
  </Panel>
</template>

<script setup lang="ts">
import { computed, ref, CSSProperties, onMounted } from 'vue';
import { getBoundsOfRects, getInternalNodesBounds, nodeHasDimensions } from '@xyflow/system';
import { shallow } from 'zustand/shallow';

import Panel from '../../components/Panel.vue';
import MiniMapNodes from './MiniMapNodes.vue';
import { useStore, useStoreApi } from '../../composables/useStore';
import type { MiniMapProps } from './types';

// Props definition with defaults
const props = withDefaults(defineProps<MiniMapProps>(), {
  position: 'bottom-right',
  nodeStrokeColor: 'transparent',
  nodeColor: '#e2e2e2',
  nodeClassName: '',
  nodeBorderRadius: 5,
  nodeStrokeWidth: 2,
  bgColor: undefined,
  maskColor: 'rgba(240, 240, 240, 0.6)',
  maskStrokeColor: 'transparent',
  maskStrokeWidth: 1,
  pannable: false,
  zoomable: false,
  ariaLabel: 'Vue Flow mini map',
  inversePan: false,
  zoomStep: 10,
  offsetScale: 5,
  width: 200,
  height: 150,
});

// Emits
const emit = defineEmits<{
  click: [event: MouseEvent, position: { x: number; y: number }];
  nodeClick: [event: MouseEvent, node: any];
}>();

// Refs
const svgRef = ref<SVGSVGElement>();

// Store
const store = useStoreApi();

// Individual reactive values (similar to Svelte's $derived pattern)
const viewBB = computed(() => {
  const state = store.getState();
  return {
    x: -state.transform[0] / state.transform[2],
    y: -state.transform[1] / state.transform[2],
    width: state.width / state.transform[2],
    height: state.height / state.transform[2],
  };
});

const boundingRect = computed(() => {
  const state = store.getState();
  const filterHidden = (node: any) => !node.hidden && nodeHasDimensions(node);
  
  return state.nodeLookup.size > 0
    ? getBoundsOfRects(getInternalNodesBounds(state.nodeLookup, { filter: filterHidden }), viewBB.value)
    : viewBB.value;
});

const rfId = computed(() => store.getState().rfId);
const panZoom = computed(() => store.getState().panZoom);
const translateExtent = computed(() => store.getState().translateExtent);
const flowWidth = computed(() => store.getState().width);
const flowHeight = computed(() => store.getState().height);

// Computed properties
const elementWidth = computed(() => props.width);
const elementHeight = computed(() => props.height);

const scaledWidth = computed(() => boundingRect.value.width / props.offsetScale);
const scaledHeight = computed(() => boundingRect.value.height / props.offsetScale);

const viewScale = computed(() => Math.min(scaledWidth.value / props.width, scaledHeight.value / props.height, 1));
const viewWidth = computed(() => viewScale.value * props.width);
const viewHeight = computed(() => viewScale.value * props.height);

const offset = computed(() => props.offsetScale * viewScale.value);
const x = computed(() => boundingRect.value.x - offset.value);
const y = computed(() => boundingRect.value.y - offset.value);
const width = computed(() => boundingRect.value.width + offset.value * 2);
const height = computed(() => boundingRect.value.height + offset.value * 2);

const labelledBy = computed(() => `vue-flow__minimap-desc-${rfId.value}`);

const panelStyle = computed(() => {
  const style: CSSProperties = {
    ...props.style,
    '--vf-minimap-background-color': typeof props.bgColor === 'string' ? props.bgColor : undefined,
    '--vf-minimap-mask-background-color': typeof props.maskColor === 'string' ? props.maskColor : undefined,
    '--vf-minimap-mask-stroke-color': typeof props.maskStrokeColor === 'string' ? props.maskStrokeColor : undefined,
    '--vf-minimap-mask-stroke-width': typeof props.maskStrokeWidth === 'number' ? props.maskStrokeWidth * viewScale.value : undefined,
    '--vf-minimap-node-background-color': typeof props.nodeColor === 'string' ? props.nodeColor : undefined,
    '--vf-minimap-node-stroke-color': typeof props.nodeStrokeColor === 'string' ? props.nodeStrokeColor : undefined,
    '--vf-minimap-node-stroke-width': typeof props.nodeStrokeWidth === 'number' ? props.nodeStrokeWidth : undefined,
  };
  return style;
});

const maskPath = computed(() => {
  return `M${x.value - offset.value},${y.value - offset.value}h${width.value + offset.value * 2}v${height.value + offset.value * 2}h${-width.value - offset.value * 2}z
    M${viewBB.value.x},${viewBB.value.y}h${viewBB.value.width}v${viewBB.value.height}h${-viewBB.value.width}z`;
});

// Event handlers
const onSvgClick = (event: MouseEvent) => {
  if (!props.pannable || !panZoom.value || !svgRef.value) {
    return;
  }

  const svg = svgRef.value;
  const rect = svg.getBoundingClientRect();
  
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  
  // Convert SVG coordinates to flow coordinates
  const svgPoint = svg.createSVGPoint();
  svgPoint.x = x;
  svgPoint.y = y;
  
  const transform = svg.getScreenCTM()?.inverse();
  if (transform) {
    const flowPoint = svgPoint.matrixTransform(transform);
    
    emit('click', event, { x: flowPoint.x, y: flowPoint.y });
    
    // Pan to clicked position
    const { x: viewportX, y: viewportY, zoom } = panZoom.value.getViewport();
    const nextX = flowWidth.value / 2 - flowPoint.x * zoom;
    const nextY = flowHeight.value / 2 - flowPoint.y * zoom;
    
    panZoom.value.setViewport({ x: nextX, y: nextY, zoom }, { duration: 0 });
  }
};

const onSvgNodeClick = (event: MouseEvent, nodeId: string) => {
  if (props.onNodeClick) {
    const node = store.getState().nodeLookup.get(nodeId)?.internals.userNode;
    if (node) {
      emit('nodeClick', event, node);
    }
  }
};

onMounted(() => {
  // Setup zoom and pan handlers if enabled
  if (props.zoomable && svgRef.value) {
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      
      if (!panZoom.value) return;
      
      const { zoom } = panZoom.value.getViewport();
      const direction = event.deltaY < 0 ? 1 : -1;
      const factor = 1 + direction * (props.zoomStep / 100);
      const newZoom = zoom * factor;
      
      panZoom.value.zoomTo(newZoom, { duration: 0 });
    };
    
    svgRef.value.addEventListener('wheel', handleWheel);
    
    return () => {
      svgRef.value?.removeEventListener('wheel', handleWheel);
    };
  }
});
</script>

<style>
.vue-flow__minimap {
  width: var(--vf-minimap-width, 200px);
  height: var(--vf-minimap-height, 150px);
  background: var(--vf-minimap-background-color, #fff);
  border: 1px solid #1a192b;
  border-radius: 5px;
  box-shadow: 0 0 2px 1px rgba(0, 0, 0, 0.08);
}

.vue-flow__minimap-svg {
  width: 100%;
  height: 100%;
  cursor: crosshair;
}

.vue-flow__minimap-mask {
  fill: var(--vf-minimap-mask-background-color, rgba(240, 240, 240, 0.6));
  stroke: var(--vf-minimap-mask-stroke-color, transparent);
  stroke-width: var(--vf-minimap-mask-stroke-width, 1);
}

.vue-flow__minimap-node {
  fill: var(--vf-minimap-node-background-color, #e2e2e2);
  stroke: var(--vf-minimap-node-stroke-color, transparent);
  stroke-width: var(--vf-minimap-node-stroke-width, 2);
}

.vue-flow__minimap-node.selected {
  fill: #ff0072;
}
</style>
