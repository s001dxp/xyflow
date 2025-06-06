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
import { Position } from '../types/position';

export default defineComponent({
  name: 'Panel',
  props: {
    position: {
      type: String,
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
      let positionStyle = {};

      switch (props.position) {
        case Position.TopLeft:
          positionStyle = { left: 10, top: 10 };
          break;
        case Position.TopRight:
          positionStyle = { right: 10, top: 10 };
          break;
        case Position.BottomLeft:
          positionStyle = { left: 10, bottom: 10 };
          break;
        case Position.BottomRight:
          positionStyle = { right: 10, bottom: 10 };
          break;
        default:
          positionStyle = { left: 10, top: 10 };
      }

      return {
        ...positionStyle,
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
