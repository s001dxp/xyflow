![readme-header](https://user-images.githubusercontent.com/2857535/279691008-efd8f0d2-d235-4f19-b136-6e81e5ba974d.svg#gh-light-mode-only)
![readme-header-dark](https://user-images.githubusercontent.com/2857535/279691021-f1cbf9e6-ea4d-43e8-935d-dd4c4983c0d9.svg#gh-dark-mode-only)

# Vue Flow

Vue Flow is a highly customizable Vue 3 library for building node-based editors, workflow systems, diagrams, and more.

## Installation

```bash
npm install @xyflow/vue
```

## Usage

```vue
<template>
  <div style="height: 800px; width: 100%">
    <VueFlow v-model:nodes="nodes" v-model:edges="edges">
      <Background />
      <Controls />
      <MiniMap />
    </VueFlow>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { VueFlow, Background, Controls, MiniMap } from '@xyflow/vue';
import '@xyflow/vue/dist/base.css';
import '@xyflow/vue/dist/style.css';

const nodes = ref([
  { id: '1', position: { x: 100, y: 100 }, data: { label: 'Node 1' } },
  { id: '2', position: { x: 300, y: 200 }, data: { label: 'Node 2' } }
]);

const edges = ref([
  { id: 'e1-2', source: '1', target: '2' }
]);
</script>
```

## Documentation

For full documentation, visit [vueflow.dev](https://vueflow.dev) (coming soon).

## Features

- 🚀 **Easy to use**: Simple API, extensive examples, detailed documentation
- 🎨 **Customizable**: Create custom nodes and edges using Vue components
- 🔌 **Interactive**: Drag & drop, zooming, panning, selection
- 🧩 **Components**: Background variants, minimap, controls
- 🧬 **Composables**: Access and manipulate the graph state with Vue composables
- 🔄 **Reactive**: Built on Vue 3's reactivity system
- 📱 **Responsive**: Works on different devices and screen sizes
- 🌗 **Theming**: Customize the appearance with CSS variables
- ⚡ **Performance**: Optimized for smooth interaction with large graphs

## Composables

Vue Flow provides composables (Vue's equivalent to React hooks) for interacting with the flow state:

```js
import { useVueFlow, useNodes, useEdges } from '@xyflow/vue';

// In your component:
const { nodes, addNodes, onNodesChange } = useNodes();
const { edges, addEdges, onEdgesChange } = useEdges();
const { fitView, zoomIn, zoomOut } = useVueFlow();
```

## Keyboard Shortcuts

- Delete: Delete selected nodes and edges
- Ctrl/⌘+C, Ctrl/⌘+V: Copy and paste selected nodes
- Ctrl/⌘+A: Select all nodes
- Arrow keys: Move selected nodes
- Shift+Mouse drag: Multiple selection

## License

MIT © [xyflow](https://xyflow.com)
