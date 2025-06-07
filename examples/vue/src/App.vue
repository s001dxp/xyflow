<template>
  <div class="app">
    <header>
      <a href="https://github.com/xyflow/xyflow" class="logo">Vue Flow Test</a>
      <select :value="currentPath" @change="onRouteChange">
        <option v-for="route in routes" :key="route.path" :value="route.path">
          {{ route.name }}
        </option>
      </select>
    </header>
    <main class="flow-container">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

interface RouteInfo {
  name: string;
  path: string;
}

const routes: RouteInfo[] = [
  { name: 'Overview', path: '/examples/overview' },
  { name: 'Basic Flow', path: '/examples/basic' },
  { name: 'Custom Node', path: '/examples/custom-node' },
  { name: 'Drag and Drop', path: '/examples/drag-n-drop' },
  { name: 'Edge Types', path: '/examples/edge-types' },
  { name: 'Interaction', path: '/examples/interaction' },
  { name: 'Validation', path: '/examples/validation' },
  { name: 'Node Toolbar', path: '/examples/node-toolbar' },
  { name: 'Color Mode', path: '/examples/color-mode' },
  { name: 'Stress Test', path: '/examples/stress' },
];

const route = useRoute();
const router = useRouter();

const currentPath = computed(() => route.path);

const onRouteChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  router.push(target.value);
};

// Update document title based on current route
watch(currentPath, (newPath) => {
  const routeInfo = routes.find(r => r.path === newPath);
  document.title = `Vue Flow Examples${routeInfo ? ' - ' + routeInfo.name : ''}`;
}, { immediate: true });
</script>
<style>
* {
  box-sizing: border-box;
}

html, body, #app {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Helvetica Neue, sans-serif;
}

.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

header {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  border-bottom: 1px solid #eee;
  background: white;
  z-index: 10;
}

.logo {
  font-weight: 700;
  color: #111;
  text-decoration: none;
  margin-right: 20px;
}

.logo:hover {
  color: #3288e5;
}

select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  font-size: 14px;
  min-width: 200px;
}

.flow-container {
  flex: 1;
  position: relative;
}
</style>
