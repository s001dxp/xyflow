<template>
  <BaseEdge
    :id="id"
    :path="edgePath"
    :label-x="labelX"
    :label-y="labelY"
    :label="label"
    :style="style"
    :class="class"
    :interacted="interacted"
    :selected="selected"
    :animated="animated"
    :label-style="labelStyle"
    :label-show-bg="labelShowBg"
    :label-bg-style="labelBgStyle"
    :label-bg-padding="labelBgPadding"
    :label-bg-border-radius="labelBgBorderRadius"
    :source-x="sourceX"
    :source-y="sourceY"
    :target-x="targetX"
    :target-y="targetY"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import BaseEdge from './BaseEdge.vue';
import { Position } from '../../types/position';

export default defineComponent({
  name: 'BezierEdge',
  components: {
    BaseEdge
  },
  props: {
    id: {
      type: String,
      required: true
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
    sourcePosition: {
      type: String,
      required: true
    },
    targetPosition: {
      type: String,
      required: true
    },
    label: {
      type: [String, Object],
      default: undefined
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
    }
  },
  setup(props) {
    const edgePath = computed(() => {
      const result = getBezierPath({
        sourceX: props.sourceX,
        sourceY: props.sourceY,
        sourcePosition: mapStringToPosition(props.sourcePosition),
        targetX: props.targetX,
        targetY: props.targetY,
        targetPosition: mapStringToPosition(props.targetPosition),
      });

      return {
        path: result[0],
        labelX: result[1],
        labelY: result[2],
      };
    });

    return {
      edgePath: computed(() => edgePath.value.path),
      labelX: computed(() => edgePath.value.labelX),
      labelY: computed(() => edgePath.value.labelY),
    };
  }
});

// Helper function to map string positions to Position enum
function mapStringToPosition(positionStr: string): Position {
  switch (positionStr) {
    case 'top': return Position.Top;
    case 'bottom': return Position.Bottom;
    case 'left': return Position.Left;
    case 'right': return Position.Right;
    default: return Position.Bottom;
  }
}

// Implementation of getBezierPath for Vue package
function getBezierPath(params: {
  sourceX: number;
  sourceY: number;
  sourcePosition: Position;
  targetX: number;
  targetY: number;
  targetPosition: Position;
}): [string, number, number] {
  const { sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition } = params;

  // Determine control points based on positions
  let sourceControlX = sourceX;
  let sourceControlY = sourceY;
  let targetControlX = targetX;
  let targetControlY = targetY;

  const offset = Math.max(Math.abs(targetX - sourceX), Math.abs(targetY - sourceY)) * 0.5;

  if (sourcePosition === Position.Top) {
    sourceControlY -= offset;
  } else if (sourcePosition === Position.Right) {
    sourceControlX += offset;
  } else if (sourcePosition === Position.Bottom) {
    sourceControlY += offset;
  } else if (sourcePosition === Position.Left) {
    sourceControlX -= offset;
  }

  if (targetPosition === Position.Top) {
    targetControlY -= offset;
  } else if (targetPosition === Position.Right) {
    targetControlX += offset;
  } else if (targetPosition === Position.Bottom) {
    targetControlY += offset;
  } else if (targetPosition === Position.Left) {
    targetControlX -= offset;
  }

  const path = `M${sourceX},${sourceY} C${sourceControlX},${sourceControlY} ${targetControlX},${targetControlY} ${targetX},${targetY}`;

  // Calculate the mid point for label positioning
  const labelX = (sourceX + targetX) / 2;
  const labelY = (sourceY + targetY) / 2;

  return [path, labelX, labelY];
}
</script>
