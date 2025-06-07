<template>
  <div style="padding: 20px; background: white; color: black;">
    <h1>Vue Test Component</h1>
    <p>If you can see this, Vue is working!</p>
    <button @click="count++">Count: {{ count }}</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const count = ref(0);
</script>
