<template>
  <div
    class="vue-flow__minimap"
    :style="minimapStyle"
  >
    <div class="vue-flow__minimap-mask" :style="maskStyle">
      <svg width="100%" height="100%">
        <g :transform="`translate(${transform.x},${transform.y}) scale(${transform.zoom})`">
          <template v-for="node in nodes" :key="node.id">
            <component
              :is="getNodeComponent(node)"
              :id="node.id"
              :type="node.type"
              :position="node.position"
              :dimensions="node.dimensions"
              :style="node.style"
              :class="node.class"
              :selected="node.selected"
            />
          </template>
        </g>
      </svg>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, onMounted, ref } from 'vue';
import { Position } from '../types/position';
import { VUE_FLOW_SYMBOL } from '../symbols';
import type { Node } from '../types';

export default defineComponent({
  name: 'MiniMap',
  props: {
    position: {
      type: String,
      default: Position.BottomRight,
      validator: (value: string) => Object.values(Position).includes(value as Position)
    },
    width: {
      type: Number,
      default: 200
    },
    height: {
      type: Number,
      default: 150
    },
    style: {
      type: Object,
      default: () => ({})
    },
    zoomable: {
      type: Boolean,
      default: false
    },
    pannable: {
      type: Boolean,
      default: false
    },
    maskColor: {
      type: String,
      default: 'rgb(240, 240, 240, 0.6)'
    },
    nodeColor: {
      type: String,
      default: '#e2e2e2'
    },
    nodeStrokeColor: {
      type: String,
      default: '#1a192b'
    },
    nodeClassName: {
      type: String,
      default: ''
    },
    nodeBorderRadius: {
      type: Number,
      default: 5
    }
  },
  setup(props) {
    const store = inject(VUE_FLOW_SYMBOL);
    const miniMapRef = ref<HTMLDivElement | null>(null);
    const transform = ref({ x: 0, y: 0, zoom: 1 });

    const minimapStyle = computed(() => {
      let positionStyle = {};

      switch (props.position) {
        case Position.TopLeft:
          positionStyle = { top: 10, left: 10 };
          break;
        case Position.TopRight:
          positionStyle = { top: 10, right: 10 };
          break;
        case Position.BottomLeft:
          positionStyle = { bottom: 10, left: 10 };
          break;
        case Position.BottomRight:
          positionStyle = { bottom: 10, right: 10 };
          break;
        default:
          positionStyle = { bottom: 10, right: 10 };
      }

      return {
        width: `${props.width}px`,
        height: `${props.height}px`,
        ...positionStyle,
        ...props.style
      };
    });

    const maskStyle = computed(() => ({
      backgroundColor: props.maskColor
    }));

    const nodes = computed(() => {
      // Access nodes from the store, but be safe about it
      return (store && 'nodes' in store) ? store.nodes : [];
    });

    const getNodeComponent = (node: Node) => {
      return 'rect';
    };

    onMounted(() => {
      // Initialize minimap viewport calculation and interaction handlers
    });

    return {
      miniMapRef,
      minimapStyle,
      maskStyle,
      transform,
      nodes,
      getNodeComponent
    };
  }
});
</script>

<style>
.vue-flow__minimap {
  position: absolute;
  background: #fff;
  border: 1px solid #1a192b;
  border-radius: 5px;
  z-index: 5;
  box-shadow: 0 0 2px 1px rgba(0, 0, 0, 0.08);
}

.vue-flow__minimap-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}
</style>
