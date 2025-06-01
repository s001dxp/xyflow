import { computed } from 'vue';
import { useVueFlow } from './useVueFlow';
import type { Node, NodeChange } from '@xyflow/system';

export function useNodes() {
  const store = useVueFlow();

  const nodes = computed(() => store.state.nodes);
  const getNode = (id: string) => store.getNode(id);
  const getNodes = () => store.getNodes();

  const addNodes = (nodesToAdd: Node[]) => {
    store.addNodes(nodesToAdd);
  };

  const setNodes = (nodes: Node[]) => {
    store.setNodes(nodes);
  };

  const onNodesChange = (changes: NodeChange[]) => {
    store.onNodesChange(changes);
  };

  return {
    nodes,
    getNode,
    getNodes,
    addNodes,
    setNodes,
    onNodesChange,
  };
}
