<template>
  <div
    :id="id"
    :class="[
      'vue-flow__node',
      `vue-flow__node-${type || 'default'}`,
      { selected },
      nodeClass
    ]"
    :style="nodeStyle"
    :data-id="id"
    :data-testid="`node-${id}`"
    @click="onClick"
    @contextmenu="onContextMenu"
    @mouseenter="onMouseEnter"
    @mousemove="onMouseMove"
    @mouseleave="onMouseLeave"
    @dblclick="onDoubleClick"
  >
    <component
      :is="nodeComponent"
      :id="id"
      :type="type"
      :data="data"
      :selected="selected"
      :zIndex="zIndex"
      :isConnectable="isConnectable"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, ref, onMounted } from 'vue';
import { Node as FlowNode, Position } from '@xyflow/system';
import { VUE_FLOW_SYMBOL } from '../symbols';

export default defineComponent({
  name: 'Node',
  props: {
    id: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'default'
    },
    data: {
      type: Object,
      default: () => ({})
    },
    position: {
      type: Object,
      required: true
    },
    style: {
      type: Object,
      default: () => ({})
    },
    class: {
      type: [String, Array, Object],
      default: ''
    },
    selected: {
      type: Boolean,
      default: false
    },
    draggable: {
      type: Boolean,
      default: true
    },
    selectable: {
      type: Boolean,
      default: true
    },
    connectable: {
      type: Boolean,
      default: true
    },
    deletable: {
      type: Boolean,
      default: true
    },
    dimensions: {
      type: Object,
      default: () => ({ width: 0, height: 0 })
    },
    zIndex: {
      type: Number,
      default: 0
    },
    isHidden: {
      type: Boolean,
      default: false
    },
    nodeOrigin: {
      type: Array,
      default: () => [0, 0]
    },
    nodeExtent: {
      type: Array,
      default: undefined
    },
    dragHandle: {
      type: String,
      default: undefined
    },
    parentNode: {
      type: String,
      default: undefined
    },
    expandParent: {
      type: Boolean,
      default: false
    }
  },
  emits: [
    'node-drag-start',
    'node-drag',
    'node-drag-stop',
    'node-mouse-enter',
    'node-mouse-move',
    'node-mouse-leave',
    'node-context-menu',
    'node-click',
    'node-double-click'
  ],
  setup(props, { emit }) {
    const store = inject(VUE_FLOW_SYMBOL);
    const nodeElement = ref<HTMLDivElement | null>(null);

    // Calculate node position
    const position = computed(() => {
      const [x, y] = props.position;
      const [originX, originY] = props.nodeOrigin;

      return {
        transform: `translate(${x - (props.dimensions.width * originX)}px, ${y - (props.dimensions.height * originY)}px)`,
        zIndex: props.zIndex
      };
    });

    // Computed styles and classes
    const nodeStyle = computed(() => ({
      ...position.value,
      ...props.style,
      visibility: props.isHidden ? 'hidden' : 'visible',
      pointerEvents: props.selectable || props.draggable ? 'all' : 'none'
    }));

    const nodeClass = computed(() => props.class);

    // Get the appropriate component for this node type
    const nodeComponent = computed(() => {
      return store?.state.nodeTypes[props.type] || 'div';
    });

    const isConnectable = computed(() => props.connectable);

    // Event handlers
    const onClick = (event: MouseEvent) => {
      emit('node-click', { id: props.id, data: props.data, event });
    };

    const onContextMenu = (event: MouseEvent) => {
      emit('node-context-menu', { id: props.id, data: props.data, event });
    };

    const onMouseEnter = (event: MouseEvent) => {
      emit('node-mouse-enter', { id: props.id, data: props.data, event });
    };

    const onMouseMove = (event: MouseEvent) => {
      emit('node-mouse-move', { id: props.id, data: props.data, event });
    };

    const onMouseLeave = (event: MouseEvent) => {
      emit('node-mouse-leave', { id: props.id, data: props.data, event });
    };

    const onDoubleClick = (event: MouseEvent) => {
      emit('node-double-click', { id: props.id, data: props.data, event });
    };

    // Implement drag handlers using xyflow's system
    onMounted(() => {
      // Initialize drag behavior
    });

    return {
      nodeElement,
      nodeStyle,
      nodeClass,
      nodeComponent,
      isConnectable,
      onClick,
      onContextMenu,
      onMouseEnter,
      onMouseMove,
      onMouseLeave,
      onDoubleClick
    };
  }
});
</script>

<style>
.vue-flow__node {
  position: absolute;
  user-select: none;
  pointer-events: all;
  transform-origin: 0 0;
  box-sizing: border-box;
  cursor: grab;
}

.vue-flow__node.selected {
  box-shadow: 0 0 0 2px #1a192b;
}

.vue-flow__node.dragging {
  cursor: grabbing;
}

.vue-flow__node-default {
  padding: 10px;
  border-radius: 3px;
  width: 150px;
  font-size: 12px;
  color: #222;
  text-align: center;
  background-color: white;
  border: 1px solid #1a192b;
}
</style>
