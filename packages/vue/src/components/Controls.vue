<template>
  <div
    :class="['vue-flow__controls', controlsClass]"
    :style="controlsStyle"
  >
    <div
      v-for="(control, index) in visibleControls"
      :key="index"
      :class="['vue-flow__controls-button', control.class]"
      :title="control.title"
      @click="control.onClick"
    >
      {{ control.label }}
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject } from 'vue';
import { Position } from '../types/position';
import { VUE_FLOW_SYMBOL } from '../symbols';

export default defineComponent({
  name: 'Controls',
  props: {
    position: {
      type: String,
      default: Position.BottomLeft,
      validator: (value: string) => Object.values(Position).includes(value as Position)
    },
    showZoom: {
      type: Boolean,
      default: true
    },
    showFitView: {
      type: Boolean,
      default: true
    },
    showLock: {
      type: Boolean,
      default: true
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
    const store = inject(VUE_FLOW_SYMBOL);

    const controlsStyle = computed(() => {
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
          positionStyle = { left: 10, bottom: 10 };
      }

      return {
        ...positionStyle,
        ...props.style
      };
    });

    const controlsClass = computed(() => props.class);

    const visibleControls = computed(() => {
      const controls = [];

      if (props.showZoom) {
        controls.push(
          {
            class: 'vue-flow__controls-zoomin',
            onClick: () => store?.zoomIn(),
            label: '+',
            title: 'Zoom in'
          },
          {
            class: 'vue-flow__controls-zoomout',
            onClick: () => store?.zoomOut(),
            label: '−',
            title: 'Zoom out'
          }
        );
      }

      if (props.showFitView) {
        controls.push({
          class: 'vue-flow__controls-fitview',
          onClick: () => store?.fitView(),
          label: '⟲',
          title: 'Fit view'
        });
      }

      if (props.showLock) {
        controls.push({
          class: 'vue-flow__controls-lock',
          onClick: () => {
            // Toggle interactive mode
          },
          label: '🔒',
          title: 'Lock/unlock'
        });
      }

      return controls;
    });

    return {
      controlsStyle,
      controlsClass,
      visibleControls
    };
  }
});
</script>

<style>
.vue-flow__controls {
  position: absolute;
  z-index: 5;
  transform: none;
  display: flex;
  flex-direction: column;
  padding: 4px;
  background: #ffffff;
  border-radius: 3px;
  box-shadow: 0 0 2px 1px rgba(0, 0, 0, 0.08);
  user-select: none;
}

.vue-flow__controls-button {
  padding: 4px;
  font-size: 16px;
  border-radius: 3px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 16px;
  height: 16px;
  margin-bottom: 2px;
  user-select: none;
  background: transparent;
  border: none;
  color: inherit;
}

.vue-flow__controls-button:hover {
  background: rgba(0, 0, 0, 0.08);
}

.vue-flow__controls-button:last-child {
  margin-bottom: 0;
}
</style>
