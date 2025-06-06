import { computed, inject, ref, watch } from 'vue';
import { VUE_FLOW_SYMBOL } from '../symbols';
import type { NodeChange, EdgeChange, Node, Edge } from '../types';
import { applyNodeChanges, applyEdgeChanges } from '../utils/changes';

/**
 * Composable for managing nodes and edges state with change handlers
 * This is the Vue equivalent of React's useNodesState and useEdgesState
 */
export function useNodesState<T extends Node = Node>(initialNodes: T[] = []) {
  const nodes = ref(initialNodes);
  
  const setNodes = (newNodes: T[] | ((prev: T[]) => T[])) => {
    if (typeof newNodes === 'function') {
      nodes.value = newNodes(nodes.value as T[]);
    } else {
      nodes.value = newNodes;
    }
  };

  const onNodesChange = (changes: NodeChange[]) => {
    // Apply changes to nodes
    nodes.value = applyNodeChanges(changes, nodes.value as T[]) as T[];
  };

  return [computed(() => nodes.value), setNodes, onNodesChange] as const;
}

export function useEdgesState<T extends Edge = Edge>(initialEdges: T[] = []) {
  const edges = ref(initialEdges);
  
  const setEdges = (newEdges: T[] | ((prev: T[]) => T[])) => {
    if (typeof newEdges === 'function') {
      edges.value = newEdges(edges.value as T[]);
    } else {
      edges.value = newEdges;
    }
  };

  const onEdgesChange = (changes: EdgeChange[]) => {
    // Apply changes to edges
    edges.value = applyEdgeChanges(changes, edges.value as T[]) as T[];
  };

  return [computed(() => edges.value), setEdges, onEdgesChange] as const;
}
