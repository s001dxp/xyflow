<template>
  <g
    class="vue-flow__connection"
    :style="style"
  >
    <path
      :d="pathString"
      class="vue-flow__connection-path"
      :marker-end="connectionStatus === 'valid' ? 'url(#vue-flow__arrow-valid)' : 'url(#vue-flow__arrow-invalid)'"
    />
  </g>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { ConnectionLineType, getBezierPath, getSmoothStepPath, getStraightPath } from '@xyflow/system';

export default defineComponent({
  name: 'ConnectionLine',
  props: {
    sourceNode: {
      type: Object,
      required: true
    },
    sourceHandle: {
      type: String,
      default: null
    },
    sourceX: {
      type: Number,
      required: true
    },
    sourceY: {
      type: Number,
      required: true
    },
    targetX: {
      type: Number,
      required: true
    },
    targetY: {
      type: Number,
      required: true
    },
    connectionPositionX: {
      type: Number,
      default: 0
    },
    connectionPositionY: {
      type: Number,
      default: 0
    },
    connectionLineType: {
      type: String as () => ConnectionLineType,
      default: ConnectionLineType.Bezier
    },
    connectionLineStyle: {
      type: Object,
      default: () => ({})
    },
    connectionStatus: {
      type: String,
      default: 'valid'
    }
  },
  setup(props) {
    const pathString = computed(() => {
      const { sourceX, sourceY, targetX, targetY, connectionLineType } = props;

      let path: [string, number, number];

      switch (connectionLineType) {
        case ConnectionLineType.Bezier:
          [path] = getBezierPath({
            sourceX,
            sourceY,
            targetX,
            targetY,
            sourcePosition: props.sourceNode.sourcePosition,
          });
          break;
        case ConnectionLineType.Step:
          [path] = getSmoothStepPath({
            sourceX,
            sourceY,
            targetX,
            targetY,
            sourcePosition: props.sourceNode.sourcePosition,
          });
          break;
        case ConnectionLineType.SmoothStep:
          [path] = getSmoothStepPath({
            sourceX,
            sourceY,
            targetX,
            targetY,
            sourcePosition: props.sourceNode.sourcePosition,
            borderRadius: 10,
          });
          break;
        case ConnectionLineType.Straight:
        default:
          [path] = getStraightPath({
            sourceX,
            sourceY,
            targetX,
            targetY,
          });
      }

      return path;
    });

    const style = computed(() => ({
      ...props.connectionLineStyle,
      pointerEvents: 'none'
    }));

    return {
      pathString,
      style
    };
  }
});
</script>

<style>
.vue-flow__connection {
  pointer-events: none;
  z-index: 1000;
}

.vue-flow__connection-path {
  fill: none;
  stroke-width: 1.5;
  stroke: #b1b1b7;
}

.vue-flow__connection.valid path {
  stroke: #43b883;
}

.vue-flow__connection.invalid path {
  stroke: #ff6060;
}
</style>
