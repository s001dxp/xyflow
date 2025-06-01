<template>
  <div
    :class="['vue-flow__panel', `vue-flow__panel-${position}`, panelClass]"
    :style="panelStyle"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { Position } from '@xyflow/system';

export default defineComponent({
  name: 'Panel',
  props: {
    position: {
      type: String as () => Position,
      default: Position.TopLeft,
      validator: (value: string) => Object.values(Position).includes(value as Position)
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
  setup(props) {
    const panelStyle = computed(() => {
      const position = {
        [Position.TopLeft]: { left: 10, top: 10 },
        [Position.TopRight]: { right: 10, top: 10 },
        [Position.BottomLeft]: { left: 10, bottom: 10 },
        [Position.BottomRight]: { right: 10, bottom: 10 }
      }[props.position];

      return {
        ...position,
        ...props.style
      };
    });

    const panelClass = computed(() => props.class);

    return {
      panelStyle,
      panelClass
    };
  }
});
</script>

<style>
.vue-flow__panel {
  position: absolute;
  z-index: 5;
  margin: 0;
  font-size: 12px;
  padding: 0;
}
</style>
