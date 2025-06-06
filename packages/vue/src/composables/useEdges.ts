import { computed } from 'vue';
import { useVueFlow } from './useVueFlow';
import type { Edge, EdgeChange, Connection } from '../types';

export function useEdges() {
  const store = useVueFlow();

  const edges = computed(() => store.edges);
  const getEdge = (id: string) => store.getEdge(id);
  const getEdges = () => store.getEdges();

  const addEdges = (edgesToAdd: Edge[]) => {
    store.addEdges(edgesToAdd);
  };

  const setEdges = (edges: Edge[]) => {
    store.setEdges(edges);
  };

  const onEdgesChange = (changes: EdgeChange[]) => {
    store.onEdgesChange(changes);
  };

  const onConnect = (connection: Connection) => {
    store.onConnect(connection);
  };

  return {
    edges,
    getEdge,
    getEdges,
    addEdges,
    setEdges,
    onEdgesChange,
    onConnect,
  };
}
