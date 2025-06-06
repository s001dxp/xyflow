<template>
  <g
    class="vue-flow__connection"
    :style="styleObj"
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
import { ConnectionLineType } from '@xyflow/system';
import { Position } from '../types/position';

export default defineComponent({
  name: 'ConnectionLine',
  props: {
    sourceNode: {
      type: Object,
      required: true
    },
    sourceHandle: {
      type: String,
      default: undefined
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
      let path: string = '';
      let x = 0;
      let y = 0;

      const sourcePosition = props.sourceNode.sourcePosition || Position.Bottom;

      switch (connectionLineType) {
        case ConnectionLineType.Bezier:
          try {
            const result = getBezierPath({
              sourceX,
              sourceY,
              sourcePosition: sourcePosition as any,
              targetX,
              targetY,
            });
            path = result[0];
          } catch (error) {
            console.error('Error creating bezier path', error);
          }
          break;
        case ConnectionLineType.Step:
          try {
            const result = getSmoothStepPath({
              sourceX,
              sourceY,
              sourcePosition: sourcePosition as any,
              targetX,
              targetY,
            });
            path = result[0];
          } catch (error) {
            console.error('Error creating step path', error);
          }
          break;
        case ConnectionLineType.SmoothStep:
          try {
            const result = getSmoothStepPath({
              sourceX,
              sourceY,
              sourcePosition: sourcePosition as any,
              targetX,
              targetY,
              borderRadius: 10,
            });
            path = result[0];
          } catch (error) {
            console.error('Error creating smooth step path', error);
          }
          break;
        case ConnectionLineType.Straight:
        default:
          try {
            const result = getStraightPath({
              sourceX,
              sourceY,
              targetX,
              targetY,
            });
            path = result[0];
          } catch (error) {
            console.error('Error creating straight path', error);
          }
      }

      return path;
    });

    const styleObj = computed(() => {
      return {
        ...props.connectionLineStyle,
        pointerEvents: 'none'
      } as any;
    });

    return {
      pathString,
      styleObj
    };
  }
});

// These functions are imported from the system package but need to be defined here
// since we don't have direct access to them
function getBezierPath(params: any): [string, number, number] {
  const { sourceX, sourceY, targetX, targetY } = params;
  const midX = sourceX + (targetX - sourceX) / 2;
  const path = `M${sourceX},${sourceY} C${midX},${sourceY} ${midX},${targetY} ${targetX},${targetY}`;
  return [path, 0, 0];
}

function getSmoothStepPath(params: any): [string, number, number] {
  const { sourceX, sourceY, targetX, targetY, borderRadius = 0 } = params;
  const midX = sourceX + (targetX - sourceX) / 2;

  if (borderRadius === 0) {
    const path = `M${sourceX},${sourceY} H${midX} V${targetY} H${targetX}`;
    return [path, 0, 0];
  }

  // With border radius
  const path = `M${sourceX},${sourceY} H${midX} V${targetY} H${targetX}`;
  return [path, 0, 0];
}

function getStraightPath(params: any): [string, number, number] {
  const { sourceX, sourceY, targetX, targetY } = params;
  const path = `M${sourceX},${sourceY} L${targetX},${targetY}`;
  return [path, 0, 0];
}
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
