<template>
  <g
    :class="[
      'vue-flow__edge',
      { selected, animated, interacted },
      edgeClass
    ]"
    @click="onClick"
    @contextmenu="onContextMenu"
    @mouseenter="onMouseEnter"
    @mousemove="onMouseMove"
    @mouseleave="onMouseLeave"
  >
    <path
      :id="id"
      :style="edgeStyle"
      :d="path"
      :class="'vue-flow__edge-path'"
      :marker-end="markerEnd"
      :marker-start="markerStart"
    />
    <path
      v-if="interactionWidth"
      :d="path"
      fill="none"
      :stroke-opacity="0"
      :stroke-width="interactionWidth"
      :class="'vue-flow__edge-interaction'"
    />
    <g
      v-if="label"
      :transform="`translate(${labelX}, ${labelY})`"
      :class="'vue-flow__edge-label'"
    >
      <rect
        v-if="labelShowBg"
        :style="computedLabelBgStyle"
        :rx="labelBgBorderRadius"
        :ry="labelBgBorderRadius"
      />
      <text
        :style="computedLabelStyle"
        :y="labelYOffset"
        text-anchor="middle"
        dominant-baseline="middle"
      >
        {{ label }}
      </text>
    </g>
  </g>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

export default defineComponent({
  name: 'BaseEdge',
  props: {
    id: {
      type: String,
      required: true
    },
    path: {
      type: String,
      required: true
    },
    labelX: {
      type: Number,
      default: 0
    },
    labelY: {
      type: Number,
      default: 0
    },
    label: {
      type: [String, Object],
      default: undefined
    },
    style: {
      type: Object,
      default: () => ({})
    },
    class: {
      type: [String, Array, Object],
      default: ''
    },
    interacted: {
      type: Boolean,
      default: false
    },
    selected: {
      type: Boolean,
      default: false
    },
    animated: {
      type: Boolean,
      default: false
    },
    labelStyle: {
      type: Object,
      default: () => ({})
    },
    labelShowBg: {
      type: Boolean,
      default: true
    },
    labelBgStyle: {
      type: Object,
      default: () => ({})
    },
    labelBgPadding: {
      type: [Number, Array],
      default: [2, 4]
    },
    labelBgBorderRadius: {
      type: Number,
      default: 4
    },
    markerEnd: {
      type: String,
      default: undefined
    },
    markerStart: {
      type: String,
      default: undefined
    },
    interactionWidth: {
      type: Number,
      default: 20
    }
  },
  emits: [
    'click',
    'contextmenu',
    'mouseenter',
    'mousemove',
    'mouseleave'
  ],
  setup(props, { emit }) {
    const edgeClass = computed(() => props.class);
    const edgeStyle = computed(() => ({
      strokeWidth: 1,
      ...props.style
    }));

    const labelYOffset = computed(() => 0);

    const computedLabelStyle = computed(() => ({
      fontSize: 12,
      ...props.labelStyle
    }));

    const computedLabelBgStyle = computed(() => ({
      fill: '#ffffff',
      ...props.labelBgStyle
    }));

    const onClick = (event: MouseEvent) => {
      emit('click', event);
    };

    const onContextMenu = (event: MouseEvent) => {
      emit('contextmenu', event);
    };

    const onMouseEnter = (event: MouseEvent) => {
      emit('mouseenter', event);
    };

    const onMouseMove = (event: MouseEvent) => {
      emit('mousemove', event);
    };

    const onMouseLeave = (event: MouseEvent) => {
      emit('mouseleave', event);
    };

    return {
      edgeClass,
      edgeStyle,
      labelYOffset,
      computedLabelStyle,
      computedLabelBgStyle,
      onClick,
      onContextMenu,
      onMouseEnter,
      onMouseMove,
      onMouseLeave
    };
  }
});
</script>

<style>
.vue-flow__edge {
  pointer-events: visibleStroke;
  cursor: pointer;
}

.vue-flow__edge.animated path {
  stroke-dasharray: 5;
  animation: dashdraw 0.5s linear infinite;
}

.vue-flow__edge.selected,
.vue-flow__edge:focus,
.vue-flow__edge:focus-visible {
  outline: none;
}

.vue-flow__edge.selected path,
.vue-flow__edge:focus path,
.vue-flow__edge:focus-visible path {
  stroke: #555;
}

.vue-flow__edge-path {
  fill: none;
  stroke: #b1b1b7;
  stroke-width: 1;
}

.vue-flow__edge-label {
  pointer-events: none;
  user-select: none;
}

@keyframes dashdraw {
  from {
    stroke-dashoffset: 10;
  }
}
</style>
