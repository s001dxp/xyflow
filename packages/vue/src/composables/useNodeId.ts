import { inject, computed } from 'vue';
import { VUE_FLOW_SYMBOL } from '../symbols';

export function useNodeId() {
  const store = inject(VUE_FLOW_SYMBOL);

  if (!store) {
    throw new Error(
      'The useNodeId composable must be used within a VueFlow component tree. ' +
      'Make sure you have wrapped your component with the VueFlow component.'
    );
  }

  /**
   * Checks if the given element is a node in the current flow
   * @param nodeOrId The node or node id to check
   * @returns Boolean indicating if the element is a node in the current flow
   */
  const isNode = (nodeOrId: any) => {
    const nodeId = typeof nodeOrId === 'string' ? nodeOrId : nodeOrId?.id;
    return !!store.getNode(nodeId);
  };

  /**
   * Gets the node with the given id
   * @param nodeId The id of the node to get
   * @returns The node with the given id, or undefined if it doesn't exist
   */
  const getNode = (nodeId: string) => {
    return store.getNode(nodeId);
  };

  return {
    isNode,
    getNode
  };
}
