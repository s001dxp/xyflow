<template>
  <div class="vue-flow__edge-labels">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'EdgeLabelRenderer'
});
</script>

<style>
.vue-flow__edge-labels {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 10;
}
</style>
