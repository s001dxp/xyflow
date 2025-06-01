import type { App } from 'vue';
import { createFlowStore } from './store';
import { VueFlow } from './components/VueFlow';
import { Background } from './components/Background';
import { MiniMap } from './components/MiniMap';
import { Controls } from './components/Controls';
import { Panel } from './components/Panel';
import { Handle } from './components/Handle';
import { EdgeLabelRenderer } from './components/EdgeLabelRenderer';
import { BezierEdge, StraightEdge, StepEdge, SmoothStepEdge } from './components/Edges';
import { ConnectionLine } from './components/ConnectionLine';

// Composables (Vue equivalent of React hooks)
import { useVueFlow } from './composables/useVueFlow';
import { useNodes } from './composables/useNodes';
import { useEdges } from './composables/useEdges';
import { useNodeId } from './composables/useNodeId';
import { useHandleConnections } from './composables/useHandleConnections';
import { useKeyPress } from './composables/useKeyPress';
import { useViewport } from './composables/useViewport';
import { useZoomPanHelper } from './composables/useZoomPanHelper';

// Re-export types from system package
export * from '@xyflow/system';

// Export components
export {
  VueFlow,
  Background,
  MiniMap,
  Controls,
  Panel,
  Handle,
  EdgeLabelRenderer,
  BezierEdge,
  StraightEdge,
  StepEdge,
  SmoothStepEdge,
  ConnectionLine
};

// Export composables
export {
  useVueFlow,
  useNodes,
  useEdges,
  useNodeId,
  useHandleConnections,
  useKeyPress,
  useViewport,
  useZoomPanHelper
};

// Export store
export { createFlowStore };

// Plugin installation
export default {
  install: (app: App) => {
    app.component('VueFlow', VueFlow);
    app.component('Background', Background);
    app.component('MiniMap', MiniMap);
    app.component('Controls', Controls);
    app.component('Panel', Panel);
    app.component('Handle', Handle);
    app.component('EdgeLabelRenderer', EdgeLabelRenderer);
    app.component('BezierEdge', BezierEdge);
    app.component('StraightEdge', StraightEdge);
    app.component('StepEdge', StepEdge);
    app.component('SmoothStepEdge', SmoothStepEdge);
    app.component('ConnectionLine', ConnectionLine);
  }
};
