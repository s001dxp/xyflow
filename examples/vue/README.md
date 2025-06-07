# Vue Flow Examples

This directory contains comprehensive examples for Vue Flow, demonstrating the various features and capabilities of the Vue 3 implementation of XYFlow.

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Examples Overview

The Vue Flow examples are designed to showcase the full capabilities of Vue Flow using modern Vue 3 conventions including Composition API, `<script setup>`, and TypeScript.

### Available Examples

1. **Overview** (`/examples/overview`)
   - Comprehensive example showcasing multiple features
   - Custom nodes with interactive elements
   - Custom edges with animations
   - Controls and toolbar integration
   - Background and minimap

2. **Basic Flow** (`/examples/basic`)
   - Simple node and edge setup
   - Basic interaction and selection
   - Perfect starting point for beginners

3. **Custom Node** (`/examples/custom-node`)
   - Interactive custom node components
   - Value increment/decrement
   - Dynamic color changing
   - Custom styling and layout

4. **Drag and Drop** (`/examples/drag-n-drop`)
   - Drag nodes from sidebar to canvas
   - Multiple node types
   - Dynamic node creation
   - Drag & drop event handling

5. **Edge Types** (`/examples/edge-types`)
   - Different edge types (default, smoothstep, step, straight)
   - Custom edge components with animations
   - Interactive edge labels and buttons
   - Edge styling and customization

6. **Interaction** (`/examples/interaction`)
   - Comprehensive event handling
   - Live event logging
   - Interactive settings controls
   - Node and edge event listeners

7. **Validation** (`/examples/validation`)
   - Connection validation rules
   - Visual feedback for valid/invalid connections
   - Custom connection logic
   - Handle-based validation

8. **Node Toolbar** (`/examples/node-toolbar`)
   - Contextual node actions
   - Delete, duplicate, and modify operations
   - Dynamic toolbar positioning
   - Interactive node manipulation

9. **Color Mode** (`/examples/color-mode`)
   - Light/dark theme switching
   - Multiple color schemes
   - Dynamic styling updates
   - Theme persistence

10. **Stress Test** (`/examples/stress`)
    - Performance testing with large datasets
    - Frame rate monitoring and recording
    - Automated interaction testing
    - Memory usage tracking

## Vue 3 Implementation Details

### Modern Vue 3 Conventions

All examples use modern Vue 3 features:

- **Composition API**: Using `<script setup lang="ts">` throughout
- **TypeScript**: Full TypeScript support with proper type definitions
- **Reactive State**: Using `ref`, `reactive`, and `computed` for state management
- **Vue Router**: Modern routing with typed route definitions
- **Composables**: Custom Vue Flow composables like `useVueFlow`

### Component Architecture

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';
import { VueFlow, useVueFlow } from '@vue-flow/core';

// TypeScript interfaces for props and data
interface Node {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: any;
}

// Reactive state management
const nodes = ref<Node[]>([]);
const edges = ref([]);

// Vue Flow composable for advanced functionality
const { onConnect, addNodes, addEdges } = useVueFlow();
</script>
```

### Custom Components

The examples include several reusable custom components:

- **CustomNode.vue**: Interactive node with increment buttons and color changing
- **InteractiveNode.vue**: Advanced node with click counting and async operations
- **CustomEdge.vue**: Animated edge with interactive labels and particles

### State Management

Vue Flow uses Vue 3's reactivity system for state management:

```typescript
// Local reactive state
const nodes = ref([]);
const edges = ref([]);

// Computed properties for derived state
const nodeCount = computed(() => nodes.value.length);

// Event handlers with proper typing
const onNodeClick = (event: MouseEvent, node: Node) => {
  console.log('Node clicked:', node);
};
```

### Event Handling

Comprehensive event handling patterns:

```vue
<VueFlow
  :nodes="nodes"
  :edges="edges"
  @node-click="onNodeClick"
  @edge-click="onEdgeClick"
  @connect="onConnect"
  @nodes-change="onNodesChange"
  @edges-change="onEdgesChange"
>
  <Controls />
  <MiniMap />
  <Background />
</VueFlow>
```

## Development Notes

### TypeScript Support

All components are fully typed with TypeScript. Custom components avoid extending base props directly to prevent Vue compiler type resolution issues:

```typescript
// Instead of extending NodeProps
interface Props {
  id: string;
  data: any;
  selected?: boolean;
  // ... other required props
}
```

### Performance Considerations

The Stress Test example demonstrates best practices for handling large datasets:

- Efficient reactivity patterns
- Proper component key usage
- Memory management for large node/edge arrays
- Frame rate monitoring for performance tracking

### Custom Styling

Examples include comprehensive CSS styling approaches:

- CSS modules for component-scoped styles
- Dynamic class binding with Vue directives
- Theme-aware styling with CSS custom properties
- Responsive design patterns

## Browser Compatibility

Vue Flow examples are compatible with modern browsers that support:

- ES2015+ features
- Vue 3 reactivity system
- CSS Grid and Flexbox
- Web APIs (Performance, RequestAnimationFrame)

## Contributing

When adding new examples:

1. Follow the established Vue 3 conventions
2. Use TypeScript for all new components
3. Include comprehensive commenting
4. Add the example to the routing configuration
5. Update this README with example descriptions

## Related Documentation

- [Vue Flow Core Documentation](../../packages/vue/README.md)
- [XYFlow System Documentation](../../packages/system/README.md)
- [Vue 3 Documentation](https://vuejs.org/)
- [Vue Router Documentation](https://router.vuejs.org/)
