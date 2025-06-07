import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import './style.css';

console.log('main.ts: Starting Vue app creation');

// Import example components
import BasicFlow from './examples/BasicFlow.vue';
import Overview from './examples/Overview.vue';
import CustomNode from './examples/CustomNode.vue';
import DragNDrop from './examples/DragNDrop.vue';
import EdgeTypes from './examples/EdgeTypes.vue';
import Interaction from './examples/Interaction.vue';
import Validation from './examples/Validation.vue';
import NodeToolbar from './examples/NodeToolbar.vue';
import ColorMode from './examples/ColorMode.vue';
import Stress from './examples/Stress.vue';

const routes = [
  { path: '/', redirect: '/examples/overview' },
  { path: '/examples/overview', name: 'Overview', component: Overview },
  { path: '/examples/basic', name: 'Basic Flow', component: BasicFlow },
  { path: '/examples/custom-node', name: 'Custom Node', component: CustomNode },
  { path: '/examples/drag-n-drop', name: 'Drag and Drop', component: DragNDrop },
  { path: '/examples/edge-types', name: 'Edge Types', component: EdgeTypes },
  { path: '/examples/interaction', name: 'Interaction', component: Interaction },
  { path: '/examples/validation', name: 'Validation', component: Validation },
  { path: '/examples/node-toolbar', name: 'Node Toolbar', component: NodeToolbar },
  { path: '/examples/color-mode', name: 'Color Mode', component: ColorMode },
  { path: '/examples/stress', name: 'Stress Test', component: Stress },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

console.log('main.ts: Router created');

const app = createApp(App);
console.log('main.ts: App created');

app.use(router);
console.log('main.ts: Router installed');

app.mount('#app');
console.log('main.ts: App mounted to #app');
