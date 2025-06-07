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
      :viewBox="viewBox"
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
  const transform = state.transform;
  
  // Guard against invalid transform values
  if (!transform || transform.length < 3 || transform[2] === 0 || !isFinite(transform[2])) {
    return { x: 0, y: 0, width: 200, height: 150 };
  }
  
  const zoom = transform[2];
  const width = state.width || 800; // fallback
  const height = state.height || 600; // fallback
  
  return {
    x: -transform[0] / zoom,
    y: -transform[1] / zoom,
    width: width / zoom,
    height: height / zoom,
  };
});

const boundingRect = computed(() => {
  const state = store.getState();
  const filterHidden = (node: any) => !node.hidden && nodeHasDimensions(node);
  
  const vbb = viewBB.value;
  
  if (state.nodeLookup.size > 0) {
    try {
      const bounds = getInternalNodesBounds(state.nodeLookup, { filter: filterHidden });
      if (bounds && isFinite(bounds.x) && isFinite(bounds.y) && isFinite(bounds.width) && isFinite(bounds.height)) {
        return getBoundsOfRects(bounds, vbb);
      }
    } catch (error) {
      console.warn('Error calculating node bounds:', error);
    }
  }
  
  return vbb;
});

const rfId = computed(() => store.getState().rfId);
const panZoom = computed(() => store.getState().panZoom);
const translateExtent = computed(() => store.getState().translateExtent);
const flowWidth = computed(() => store.getState().width);
const flowHeight = computed(() => store.getState().height);

// Computed properties
const elementWidth = computed(() => props.width);
const elementHeight = computed(() => props.height);

const scaledWidth = computed(() => {
  const rect = boundingRect.value;
  const width = elementWidth.value;
  if (!rect || !width || width === 0) return 1;
  return rect.width / width;
});

const scaledHeight = computed(() => {
  const rect = boundingRect.value;
  const height = elementHeight.value;
  if (!rect || !height || height === 0) return 1;
  return rect.height / height;
});

const viewScale = computed(() => {
  const scaleW = scaledWidth.value;
  const scaleH = scaledHeight.value;
  if (!isFinite(scaleW) || !isFinite(scaleH)) return 1;
  return Math.max(scaleW, scaleH);
});
const viewWidth = computed(() => {
  const scale = viewScale.value;
  const width = elementWidth.value;
  if (!isFinite(scale) || !isFinite(width)) return 200; // fallback
  return scale * width;
});

const viewHeight = computed(() => {
  const scale = viewScale.value;
  const height = elementHeight.value;
  if (!isFinite(scale) || !isFinite(height)) return 150; // fallback
  return scale * height;
});

const offset = computed(() => {
  const scale = viewScale.value;
  const offsetScale = props.offsetScale;
  if (!isFinite(scale) || !isFinite(offsetScale)) return 5; // fallback
  return offsetScale * scale;
});

const x = computed(() => {
  const rect = boundingRect.value;
  const vw = viewWidth.value;
  const off = offset.value;
  if (!rect || !isFinite(vw) || !isFinite(off)) return 0;
  return rect.x - (vw - rect.width) / 2 - off;
});

const y = computed(() => {
  const rect = boundingRect.value;
  const vh = viewHeight.value;
  const off = offset.value;
  if (!rect || !isFinite(vh) || !isFinite(off)) return 0;
  return rect.y - (vh - rect.height) / 2 - off;
});

const width = computed(() => {
  const vw = viewWidth.value;
  const off = offset.value;
  if (!isFinite(vw) || !isFinite(off)) return 200; // fallback
  return vw + off * 2;
});

const height = computed(() => {
  const vh = viewHeight.value;
  const off = offset.value;
  if (!isFinite(vh) || !isFinite(off)) return 150; // fallback
  return vh + off * 2;
});

const labelledBy = computed(() => `vue-flow__minimap-desc-${rfId.value}`);

const viewBox = computed(() => {
  const xVal = x.value;
  const yVal = y.value;
  const wVal = width.value;
  const hVal = height.value;
  
  // Ensure all values are finite numbers
  const safeX = isFinite(xVal) ? xVal : 0;
  const safeY = isFinite(yVal) ? yVal : 0;
  const safeW = isFinite(wVal) && wVal > 0 ? wVal : 200;
  const safeH = isFinite(hVal) && hVal > 0 ? hVal : 150;
  
  return `${safeX} ${safeY} ${safeW} ${safeH}`;
});

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
  const xVal = x.value;
  const yVal = y.value;
  const wVal = width.value;
  const hVal = height.value;
  const offVal = offset.value;
  const vbb = viewBB.value;
  
  // Ensure all values are finite numbers
  const safeX = isFinite(xVal) ? xVal : 0;
  const safeY = isFinite(yVal) ? yVal : 0;
  const safeW = isFinite(wVal) ? wVal : 200;
  const safeH = isFinite(hVal) ? hVal : 150;
  const safeOff = isFinite(offVal) ? offVal : 5;
  
  const safeBBX = isFinite(vbb.x) ? vbb.x : 0;
  const safeBBY = isFinite(vbb.y) ? vbb.y : 0;
  const safeBBW = isFinite(vbb.width) ? vbb.width : 200;
  const safeBBH = isFinite(vbb.height) ? vbb.height : 150;
  
  return `M${safeX - safeOff},${safeY - safeOff}h${safeW + safeOff * 2}v${safeH + safeOff * 2}h${-safeW - safeOff * 2}z
    M${safeBBX},${safeBBY}h${safeBBW}v${safeBBH}h${-safeBBW}z`;
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
      
      // Use simplified zoom approach
      if (panZoom.value && 'setScaleExtent' in panZoom.value) {
        panZoom.value.setScaleExtent([0.1, 2]);
      }
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
