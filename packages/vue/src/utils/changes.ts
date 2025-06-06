// Change utility functions for Vue Flow
import type { Node, Edge, NodeChange, EdgeChange } from '../types';

/**
 * Applies changes to nodes array
 */
export function applyNodeChanges<NodeType extends Node = Node>(
  changes: NodeChange[],
  nodes: NodeType[]
): NodeType[] {
  const nodeIds = new Set(nodes.map(n => n.id));
  const selectedNodeIds = new Set(nodes.filter(n => n.selected).map(n => n.id));
  
  return changes.reduce((acc, change) => {
    switch (change.type) {
      case 'add':
        if (!nodeIds.has(change.item.id)) {
          acc.push(change.item as NodeType);
          nodeIds.add(change.item.id);
        }
        break;
      case 'remove':
        return acc.filter(n => n.id !== change.id);
      case 'select':
        return acc.map(n => n.id === change.id ? { ...n, selected: change.selected } : n);
      case 'position':
        return acc.map(n => n.id === change.id ? { ...n, position: change.position } : n);
      case 'dimensions':
        return acc.map(n => n.id === change.id ? { ...n, dimensions: change.dimensions } : n);
      default:
        return acc;
    }
    return acc;
  }, [...nodes]);
}

/**
 * Applies changes to edges array
 */
export function applyEdgeChanges<EdgeType extends Edge = Edge>(
  changes: EdgeChange[],
  edges: EdgeType[]
): EdgeType[] {
  const edgeIds = new Set(edges.map(e => e.id));
  
  return changes.reduce((acc, change) => {
    switch (change.type) {
      case 'add':
        if (!edgeIds.has(change.item.id)) {
          acc.push(change.item as EdgeType);
          edgeIds.add(change.item.id);
        }
        break;
      case 'remove':
        return acc.filter(e => e.id !== change.id);
      case 'select':
        return acc.map(e => e.id === change.id ? { ...e, selected: change.selected } : e);
      default:
        return acc;
    }
    return acc;
  }, [...edges]);
}

/**
 * Creates a selection change for nodes
 */
export function createNodeSelectionChange(nodeId: string, selected: boolean): NodeChange {
  return {
    type: 'select',
    id: nodeId,
    selected
  };
}

/**
 * Creates a selection change for edges
 */
export function createEdgeSelectionChange(edgeId: string, selected: boolean): EdgeChange {
  return {
    type: 'select',
    id: edgeId,
    selected
  };
}
