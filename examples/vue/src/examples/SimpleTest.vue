<template>
  <div class="simple-test">
    <h1>Simple Test</h1>
    <p>This is a basic Vue component without any Vue Flow imports.</p>
    <button @click="increment">Count: {{ count }}</button>
    <div>Current time: {{ currentTime }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const count = ref(0);
const currentTime = ref('');

const increment = () => {
  count.value++;
  console.log('Button clicked, count:', count.value);
};

onMounted(() => {
  currentTime.value = new Date().toLocaleString();
  console.log('SimpleTest component mounted successfully');
});
</script>

<style scoped>
.simple-test {
  padding: 20px;
  text-align: center;
}

h1 {
  color: #2c3e50;
  margin-bottom: 20px;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  background: #007acc;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 10px;
}

button:hover {
  background: #005a9a;
}
</style>
