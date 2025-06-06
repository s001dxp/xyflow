<template>
  <Teleport to=".vue-flow__viewport" v-if="isMounted">
    <slot />
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

/**
 * ViewportPortal component for rendering content within the viewport
 * This is the Vue equivalent of React's ViewportPortal
 */
const isMounted = ref(false);

onMounted(() => {
  isMounted.value = true;
});
</script>
