<template>
  <div
    :class="[
      'vue-flow__node-default',
      { selected }
    ]"
    :data-testid="`node-${id}`"
  >
    <Handle
      v-if="hasTargetHandle"
      type="target"
      :position="targetPosition"
      :is-connectable="isConnectable"
    />
    <div class="vue-flow__node-default-inner">
      {{ data?.label || id }}
    </div>
    <Handle
      v-if="hasSourceHandle"
      type="source"
      :position="sourcePosition"
      :is-connectable="isConnectable"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Position } from '@xyflow/system';
import Handle from '../Handle.vue';

export default defineComponent({
  name: 'DefaultNode',
  components: {
    Handle
  },
  props: {
    id: {
      type: String,
      required: true
    },
    data: {
      type: Object,
      default: () => ({})
    },
    selected: {
      type: Boolean,
      default: false
    },
    isConnectable: {
      type: Boolean,
      default: true
    },
    targetPosition: {
      type: String as () => Position,
      default: Position.Top
    },
    sourcePosition: {
      type: String as () => Position,
      default: Position.Bottom
    },
    hasTargetHandle: {
      type: Boolean,
      default: true
    },
    hasSourceHandle: {
      type: Boolean,
      default: true
    }
  }
});
</script>

<style>
.vue-flow__node-default {
  padding: 10px;
  border-radius: 3px;
  min-width: 150px;
  font-size: 12px;
  color: #222;
  text-align: center;
  background-color: white;
  border: 1px solid #1a192b;
}

.vue-flow__node-default.selected,
.vue-flow__node-default.selected:hover {
  box-shadow: 0 0 0 2px #1a192b;
}

.vue-flow__node-default-inner {
  width: 100%;
  height: 100%;
}
</style>
