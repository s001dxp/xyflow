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
import { getSmoothStepPath } from '@xyflow/system';
import BaseEdge from './BaseEdge.vue';

export default defineComponent({
  name: 'SmoothStepEdge',
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
    borderRadius: {
      type: Number,
      default: 10
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
      const [path, labelX, labelY] = getSmoothStepPath({
        sourceX: props.sourceX,
        sourceY: props.sourceY,
        sourcePosition: props.sourcePosition,
        targetX: props.targetX,
        targetY: props.targetY,
        targetPosition: props.targetPosition,
        borderRadius: props.borderRadius,
      });

      return {
        path,
        labelX,
        labelY,
      };
    });

    return {
      edgePath: computed(() => edgePath.value.path),
      labelX: computed(() => edgePath.value.labelX),
      labelY: computed(() => edgePath.value.labelY),
    };
  }
});
</script>
