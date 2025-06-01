<template>
  <div
    :class="[
      'vue-flow__handle',
      `vue-flow__handle-${position}`,
      {
        'vue-flow__handle-connecting': isConnecting,
        'vue-flow__handle-valid': isValid
      },
      handleClass
    ]"
    :style="handleStyle"
    @mousedown="onMouseDown"
    @click="onClick"
  ></div>
</template>

<script lang="ts">
import { computed, defineComponent, inject } from 'vue';
import { Position } from '@xyflow/system';
import { VUE_FLOW_SYMBOL } from '../symbols';

export default defineComponent({
  name: 'Handle',
  props: {
    type: {
      type: String,
      default: 'source',
      validator: (value: string) => ['source', 'target'].includes(value)
    },
    position: {
      type: String as () => Position,
      default: Position.Top,
      validator: (value: string) => Object.values(Position).includes(value as Position)
    },
    id: {
      type: String,
      default: undefined
    },
    isConnectable: {
      type: Boolean,
      default: true
    },
    isConnecting: {
      type: Boolean,
      default: false
    },
    isValid: {
      type: Boolean,
      default: false
    },
    style: {
      type: Object,
      default: () => ({})
    },
    class: {
      type: [String, Array, Object],
      default: ''
    }
  },
  emits: ['handle-connect-start', 'handle-connect-end', 'handle-click'],
  setup(props, { emit }) {
    const store = inject(VUE_FLOW_SYMBOL);

    const handleStyle = computed(() => ({
      ...props.style,
      cursor: props.isConnectable ? 'crosshair' : 'default'
    }));

    const handleClass = computed(() => props.class);

    const onMouseDown = (event: MouseEvent) => {
      if (!props.isConnectable) return;

      // Handle connection start logic
      emit('handle-connect-start', {
        nodeId: '', // This would be set by the parent node
        handleId: props.id,
        handleType: props.type,
        event
      });
    };

    const onClick = (event: MouseEvent) => {
      if (!props.isConnectable) return;

      emit('handle-click', {
        nodeId: '', // This would be set by the parent node
        handleId: props.id,
        handleType: props.type,
        event
      });
    };

    return {
      handleStyle,
      handleClass,
      onMouseDown,
      onClick
    };
  }
});
</script>

<style>
.vue-flow__handle {
  position: absolute;
  width: 14px;
  height: 14px;
  background: #1a192b;
  border: 2px solid white;
  border-radius: 100%;
  cursor: crosshair;
}

.vue-flow__handle-top {
  top: -7px;
  left: 50%;
  transform: translate(-50%, 0);
}

.vue-flow__handle-right {
  right: -7px;
  top: 50%;
  transform: translate(0, -50%);
}

.vue-flow__handle-bottom {
  bottom: -7px;
  left: 50%;
  transform: translate(-50%, 0);
}

.vue-flow__handle-left {
  left: -7px;
  top: 50%;
  transform: translate(0, -50%);
}

.vue-flow__handle-connecting {
  background: #ff6060;
}

.vue-flow__handle-valid {
  background: #55dd99;
}
</style>
